import pyupbit
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import math
import os
import tensorflow as tf
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error

# API 키 설정 (주의: 실제 코드에서는 보안상 API 키를 노출시키지 않도록 주의해야 합니다)
access_key = "3rCnY46Xw4Mx9q2tVrWGpzUPBtAjim82ZMn508Bd"
secret_key = "R1t5gFoPNZNTXaBlWHbdx85hPPvdhvSSZx2Y9uA7"

# 데이터 수집 기간 설정
start_date = datetime.datetime(2018, 1, 1)
time_now = datetime.datetime.now()
days_count = (time_now - start_date).days

# 업비트에서 데이터 수집
df = pyupbit.get_ohlcv("KRW-BTC", interval='day', count=days_count)

# 날짜를 열로 변환하고 필요한 열만 유지
df['date'] = df.index.strftime('%Y-%m-%d')
df = df[['date', 'close', 'volume']]
df_original=df.copy()
# 데이터 스케일링
scaler = MinMaxScaler()
df[['close', 'volume']] = scaler.fit_transform(df[['close', 'volume']])
#print("data_scaling 결과")
#print(df.head())


# 데이터셋 함수 정의
def Dataset(Data, split_ratio):
    # Data에서 총 행 수를 계산
    total_rows = len(Data)
    
    # 훈련 데이터의 끝 인덱스 계산
    train_end_idx = int(total_rows * split_ratio)

    # 날짜 형식을 datetime으로 변환
    Data['date'] = pd.to_datetime(Data['date'])
    
    # # 훈련 데이터와 테스트 데이터 분리
    # Train_Data = Data[['date', 'close', 'volume']].iloc[:train_end_idx].to_numpy()
    # Test_Data = Data[['date', 'close', 'volume']].iloc[train_end_idx:].to_numpy()

    # # 훈련 데이터의 날짜 범위 출력
    # train_start_date = Train_Data[0][0]
    # train_end_date = Train_Data[-1][0]
    # print(f"Train Data: Start Date = {train_start_date}, End Date = {train_end_date}")

    # # 테스트 데이터의 날짜 범위 출력
    # test_start_date = Test_Data[0][0]
    # test_end_date = Test_Data[-1][0]
    # print(f"Test Data: Start Date = {test_start_date}, End Date = {test_end_date}")
    
    # 훈련 데이터와 테스트 데이터 분리
    Train_Data = Data[['close', 'volume']].iloc[:train_end_idx].to_numpy()
    Test_Data = Data[['close', 'volume']].iloc[train_end_idx:].to_numpy()
    
    #  # 훈련 데이터와 테스트 데이터의 개수 출력
    # train_data_count = len(Train_Data)
    # test_data_count = len(Test_Data)
    # print(f"Train Data Count: {train_data_count}")
    # print(f"Test Data Count: {test_data_count}")

    # 훈련 데이터셋 생성
    Data_Train = []
    for i in range(0, len(Train_Data) - 4, 5):
        Data_Train.append(Train_Data[i:i + 5])
    Data_Train_X = np.array(Data_Train[:-1]).reshape((-1, 5, 2))
    Data_Train_Y = np.array([sequence[:, 0] for sequence in Data_Train[1:]]).reshape((-1, 5, 1))

    # 테스트 데이터셋 생성
    Data_Test = []
    for i in range(0, len(Test_Data) - 4, 5):
        Data_Test.append(Test_Data[i:i + 5])
    Data_Test_X = np.array(Data_Test[:-1]).reshape((-1, 5, 2))
    Data_Test_Y = np.array([sequence[:, 0] for sequence in Data_Test[1:]]).reshape((-1, 5, 1))

    return Data_Train_X, Data_Train_Y, Data_Test_X, Data_Test_Y

# ################################ base LSTM model ####################################
def Model(): 
  model = tf.keras.models.Sequential([
                                      tf.keras.layers.LSTM(200, input_shape = (5, 2), activation = tf.nn.leaky_relu, return_sequences = True),
                                      tf.keras.layers.LSTM(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(100, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(50, activation = tf.nn.leaky_relu),
                                    #   tf.keras.layers.Dense(25, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(5, activation = tf.nn.leaky_relu)
                                      ])
  return model

model=Model()

# ########################## GRU 기반 모델 ###################################################
# def Model(): 
#    model = tf.keras.models.Sequential([
#         tf.keras.layers.GRU(200, input_shape=(5, 2), activation='relu', return_sequences=True),
#         tf.keras.layers.GRU(200, activation='relu'),
#         tf.keras.layers.Dense(200, activation='relu'),
#         tf.keras.layers.Dense(100, activation='relu'),
#         tf.keras.layers.Dense(50, activation='relu'),
#         tf.keras.layers.Dense(5, activation='relu')
#     ])
#    return model

# model=Model()

# ########################### Transformer 모델 ###########################################
# def Model():
#     input_layer = tf.keras.layers.Input(shape=(5, 2))
#     x = tf.keras.layers.Dense(128)(input_layer)
#     x = tf.keras.layers.MultiHeadAttention(num_heads=4, key_dim=128)(x, x)
#     x = tf.keras.layers.LayerNormalization()(x)
#     x = tf.keras.layers.Dense(200, activation='relu')(x)
#     x = tf.keras.layers.Dense(100, activation='relu')(x)
#     x = tf.keras.layers.Dense(50, activation='relu')(x)
#     x = tf.keras.layers.Flatten()(x)

#     output_layer = tf.keras.layers.Dense(5, activation='relu')(x)
    
#     model = tf.keras.models.Model(inputs=input_layer, outputs=output_layer)
#     return model
# model=Model()

######################### CNN + LSTM 모델 ################################################
# def Model():
#     model = tf.keras.models.Sequential([
#         # Reshape to add an extra dimension
#         tf.keras.layers.Reshape((5, 2, 1), input_shape=(5, 2)),
        
#         # TimeDistributed Conv1D with the new shape
#         tf.keras.layers.TimeDistributed(
#             tf.keras.layers.Conv1D(filters=64, kernel_size=2, activation=tf.nn.leaky_relu)
#         ),
#         tf.keras.layers.TimeDistributed(tf.keras.layers.MaxPooling1D(pool_size=1)),  # Changed pool_size to 1
        
#         tf.keras.layers.TimeDistributed(tf.keras.layers.Conv1D(filters=128, kernel_size=1, activation=tf.nn.leaky_relu)),  # Changed kernel_size to 1
#         tf.keras.layers.TimeDistributed(tf.keras.layers.MaxPooling1D(pool_size=1)),  # Changed pool_size to 1
        
#         # Flatten the output to feed into LSTM
#         tf.keras.layers.TimeDistributed(tf.keras.layers.Flatten()),
        
#         # LSTM layers
#         tf.keras.layers.LSTM(200, activation=tf.nn.leaky_relu, return_sequences=True),
#         tf.keras.layers.LSTM(200, activation=tf.nn.leaky_relu),
        
#         # Dense layers
#         tf.keras.layers.Dense(200, activation=tf.nn.leaky_relu),
#         tf.keras.layers.Dense(100, activation=tf.nn.leaky_relu),
#         tf.keras.layers.Dense(50, activation=tf.nn.leaky_relu),
#         tf.keras.layers.Dense(5, activation=tf.nn.leaky_relu)
#     ])
#     return model

# ################################ LSTM model_correction ####################################
# def Model(): 
#   model = tf.keras.models.Sequential([
#                                       tf.keras.layers.LSTM(200, input_shape = (5, 2), activation = tf.nn.leaky_relu, return_sequences = True),
#                                       tf.keras.layers.LSTM(200, activation = tf.nn.leaky_relu),
#                                       tf.keras.layers.Dense(200, activation = tf.nn.leaky_relu),
#                                       tf.keras.layers.Dense(100, activation = tf.nn.leaky_relu),
#                                       tf.keras.layers.Dense(60, activation = tf.nn.leaky_relu),
#                                       tf.keras.layers.Dense(20, activation = tf.nn.leaky_relu),
#                                       tf.keras.layers.Dense(5, activation = tf.nn.leaky_relu)
#                                       ])
#   return model

# model=Model()

train_test_split_ratio = 0.9
train_x, train_y, test_x, test_y = Dataset(df, train_test_split_ratio)



# 새로운 모델 생성
loaded_model = Model()

# 가중치 로드
loaded_model.load_weights('checkpoints/ex3_node_2/training_basemodel.ckpt')

# 모델 컴파일
loaded_model.compile(
    optimizer=tf.keras.optimizers.Adam(),
    loss='mse',
    metrics=[tf.keras.metrics.RootMeanSquaredError()]
)

# 모델 사용 예시
# 평가 또는 예측 작업에 사용 가능
# loaded_model.evaluate(test_x, test_y)
# 모델 예측 수행
prediction = loaded_model.predict(test_x)

# 예측 결과의 형상 확인 및 변형
#print(prediction.shape)

prediction = prediction.reshape(-1)
#print(prediction.shape)

# 원래 스케일로 복원하기 위한 데이터프레임 생성
pred_df = pd.DataFrame(np.zeros((len(prediction), 2)), columns=["close", "volume"])
pred_df['close'] = prediction

# 예측된 close 데이터를 원래 스케일로 복원하기 위한 데이터프레임 생성
pred_df = pd.DataFrame(np.zeros((len(prediction), 2)), columns=["close", "volume"])
pred_df['close'] = prediction

# 원래 스케일로 복원
prediction_scaled = scaler.inverse_transform(pred_df)

# 볼륨 데이터 삭제
prediction_scaled = prediction_scaled[:, 0]  # 열 인덱스 0번을 가져옴, 즉 close 데이터만 추출

# 결과 출력
# print(prediction_scaled)
# print(prediction_scaled.shape)


################################ 오차 계산 ######################################################
actual_values = df_original['close'][df['date'] >= '2023-10-27'][:-6].to_numpy()
predicted_values = prediction_scaled.reshape(-1)
print(len(predicted_values))
# MSE 계산
mse = mean_squared_error(actual_values, predicted_values)
rmse =  math.sqrt(mean_squared_error(actual_values, predicted_values))
# 결과 출력
print(f"Mean Squared Error: {mse}")
print(f"rootMean Squared Error: {rmse}")


################################# 결과 시각화 ######################################################
plt.figure(figsize=(20, 5))

# Training 데이터 시각화
# plt.plot(df['date'][df['date'] < '2023-10-27'], df['close'][df['date'] < '2023-10-27'], label='Training')

# Testing 데이터 시각화
# plt.plot(df['date'][df['date'] >= '2023-09-30'][:-7], df['close'][df['date'] >= '2023-09-30'][:-7], label='Testing')
plt.plot(df['date'][df['date'] >= '2023-10-27'], df['close'][df['date'] >= '2023-10-27'], label='Testing')

# 예측 결과 시각화
plt.plot(df['date'][df['date'] >= '2023-10-27'][:-6], prediction.reshape(-1), label='Predictions')

plt.xlabel('Time')
plt.ylabel('Closing Price')
plt.legend(loc='best')

# 그래프를 파일로 저장
#plt.savefig('prediction_results_prediction&test.png')

plt.show()