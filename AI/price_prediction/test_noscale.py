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

# API 키 설정 API키 추가하기
access_key = ""
secret_key = ""

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
# scaler = MinMaxScaler()
# df[['close', 'volume']] = scaler.fit_transform(df[['close', 'volume']])
# #print("data_scaling 결과")
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

################################ base LSTM model ####################################
def Model(): 
  model = tf.keras.models.Sequential([
                                      tf.keras.layers.LSTM(200, input_shape = (5, 2), activation = tf.nn.leaky_relu, return_sequences = True),
                                      tf.keras.layers.LSTM(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(100, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(50, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(25, activation = tf.nn.leaky_relu),
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

# ######################### CNN + LSTM 모델 ################################################
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

################################ LSTM model_correction ####################################
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
# tf.keras.utils.plot_model(model,show_shapes=True) 모델 확인하는 코드지만 실행안되서 일단 정지함

# model.summary() # 모델 모양 출력

# def scheduler(epoch):

#   if epoch <= 150:
#     lrate = (10 ** -5) * (epoch / 150)
#   elif epoch <= 400:
#     initial_lrate = (10 ** -5)
#     k = 0.01
#     lrate = initial_lrate * math.exp(-k * (epoch - 150))
#   else:
#     lrate = (10 ** -6)

#   return lrate

# epochs = [i for i in range(1, 1001, 1)]
# lrate = [scheduler(i) for i in range(1, 1001, 1)]

# callback = tf.keras.callbacks.LearningRateScheduler(scheduler) # epoch마다 callback으로 learning rate 수정
# df["date"] = pd.to_datetime(df["date"])

# 데이터셋을 train과 test로 분할
train_test_split_ratio = 0.9
train_x, train_y, test_x, test_y = Dataset(df, train_test_split_ratio)


################## 모델 저장 ############################ 

# # 경로 설정
# checkpoint_path = './checkpoints/training_basemodel.ckpt'
# checkpoint_dir = os.path.dirname(checkpoint_path)

# # 디렉터리 생성
# if not os.path.exists(checkpoint_dir):
#     os.makedirs(checkpoint_dir)

# checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
#     filepath=checkpoint_path,
#     save_weights_only=True,   # 가중치만 저장, 모델 전체를 저장하려면 False로 변경
#     save_best_only=True,      # 가장 성능이 좋은 모델만 저장
#     monitor='val_loss',       # 검증 손실을 기준으로 모델 저장
#     verbose=1                 # 저장 시 메시지 출력
# )
# # 모델 훈련, 훈련할 때마다 가장 좋은 모델을 저장함
# df_Model=Model()
# df_Model.compile(optimizer = tf.keras.optimizers.Adam(), 
#                  loss = 'mse', 
#                  metrics = tf.keras.metrics.RootMeanSquaredError())

# df_hist = df_Model.fit(train_x, 
#                        train_y, 
#                        epochs = 1000, 
#                        validation_data = (test_x, test_y), 
#                        callbacks=[callback,checkpoint_callback])



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
print(prediction.shape)

# 결과 출력
# print(prediction_scaled)
# print(prediction_scaled.shape)


################################## 오차 계산 ######################################################
actual_values = df_original['close'][df['date'] >= '2023-10-27'][:-6].to_numpy()
predicted_values = prediction.reshape(-1)
# predicted_values = prediction_scaled.reshape(-1)

# MSE 계산
mse = mean_squared_error(actual_values, predicted_values)
rmse =  math.sqrt(mean_squared_error(actual_values, predicted_values))
# 결과 출력
print(f"Mean Squared Error: {mse}")
print(f"Root Mean Squared Error: {rmse}")


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
