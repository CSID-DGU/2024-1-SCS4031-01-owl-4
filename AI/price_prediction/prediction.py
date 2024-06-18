import pyupbit
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import math
import os
import tensorflow as tf
import matplotlib.pyplot as plt

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
    
    # 훈련 데이터와 테스트 데이터 분리
    Train_Data = Data[['close', 'volume']].iloc[:train_end_idx].to_numpy()
    Test_Data = Data[['close', 'volume']].iloc[train_end_idx:].to_numpy()

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

def Model():
  model = tf.keras.models.Sequential([
                                      tf.keras.layers.LSTM(200, input_shape = (5, 2), activation = tf.nn.leaky_relu, return_sequences = True),
                                      tf.keras.layers.LSTM(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(100, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(50, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(5, activation = tf.nn.leaky_relu)
                                      ])
  return model

model=Model()
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
print(test_x.shape)

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
loaded_model.load_weights('checkpoints/training_basemodel.ckpt')

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
#print(prediction_scaled.shape)

# prediction_scaled의 마지막 5개 값 추출
last_5_values = prediction_scaled[-5:]

# 오늘 날짜부터 5일간의 날짜 생성
start_date = datetime.datetime.now().date()
dates = [start_date + datetime.timedelta(days=i) for i in range(5)]

# 데이터프레임 생성
result_df = pd.DataFrame({
    'date': dates,
    'close': last_5_values
})

# 결과 출력
print(result_df)

# 데이터프레임 df는 전체 데이터를 포함하고 있어야 합니다. ( 확인 필요 )

# 예측 결과 시각화
# plt.figure(figsize=(20, 5))
# plt.plot(df['date'][df['date'] < '2023-09-30'], df['close'][df['date'] < '2023-09-30'], label='Training')
# plt.plot(df['date'][df['date'] >= '2023-09-30'][:-7], df['close'][df['date'] >= '2023-09-30'][:-7], label='Testing')
# plt.plot(df['date'][df['date'] >= '2023-09-30'][-7:], prediction.reshape(-1), label='Predictions')
# plt.xlabel('Time')
# plt.ylabel('Closing Price')
# plt.legend(loc='best')
# plt.show()