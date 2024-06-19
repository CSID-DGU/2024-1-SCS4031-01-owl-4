import pyupbit
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler ,RobustScaler
import numpy as np
import math
import os
import tensorflow as tf

# 데이터 노이즈 추가 함수
def add_gaussian_noise(data, mean=0, std_dev=0.01):
    noise = np.random.normal(mean, std_dev, data.shape)
    noisy_data = data + noise
    return noisy_data
  
  
# API 키 설정 : 추가하기
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


# # 데이터 스케일링
# scaler = MinMaxScaler()
# # scaler = RobustScaler()
# df[['close', 'volume']] = scaler.fit_transform(df[['close', 'volume']])
# print("data_scaling 결과")
# print(df.head())


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
    
    # Train 데이터에만 Gaussian noise 추가
    Train_Data = Data.iloc[:train_end_idx].copy()
    Train_Data['close'] = add_gaussian_noise(Train_Data['close'].values, mean=0, std_dev=0.01)
    Train_Data = Train_Data[['close', 'volume']].to_numpy()
    
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

    return Data_Train_X, Data_Train_Y, Data_Test_X, Data_Test_Y\
    
################################ base LSTM model ####################################
def Model(): 
  model = tf.keras.models.Sequential([
                                      tf.keras.layers.LSTM(200, input_shape = (5, 2), activation = tf.nn.leaky_relu, return_sequences = True),
                                      tf.keras.layers.LSTM(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(200, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(100, activation = tf.nn.leaky_relu),
                                      tf.keras.layers.Dense(50, activation = tf.nn.leaky_relu),
                                      # tf.keras.layers.Dense(25, activation = tf.nn.leaky_relu),
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
  
model=Model()
# tf.keras.utils.plot_model(model,show_shapes=True) 모델 확인하는 코드지만 실행안되서 일단 정지함

model.summary() # 모델 모양 출력

def scheduler(epoch):

  if epoch <= 150:
    lrate = (10 ** -5) * (epoch / 150)
  elif epoch <= 400:
    initial_lrate = (10 ** -5)
    k = 0.01
    lrate = initial_lrate * math.exp(-k * (epoch - 150))
  else:
    lrate = (10 ** -6)

  return lrate

epochs = [i for i in range(1, 1001, 1)]
lrate = [scheduler(i) for i in range(1, 1001, 1)]

callback = tf.keras.callbacks.LearningRateScheduler(scheduler) # epoch마다 callback으로 learning rate 수정
df["date"] = pd.to_datetime(df["date"])

# 데이터셋을 train과 test로 분할
train_test_split_ratio = 0.9
train_x, train_y, test_x, test_y = Dataset(df, train_test_split_ratio)

################## 모델 저장 ############################ 

# 경로 설정
checkpoint_path = './checkpoints/ex3_node_2/training_basemodel.ckpt'
checkpoint_dir = os.path.dirname(checkpoint_path)

# 디렉터리 생성
if not os.path.exists(checkpoint_dir):
    os.makedirs(checkpoint_dir)

checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
    filepath=checkpoint_path,
    save_weights_only=True,   # 가중치만 저장, 모델 전체를 저장하려면 False로 변경
    save_best_only=True,      # 가장 성능이 좋은 모델만 저장
    monitor='val_loss',       # 검증 손실을 기준으로 모델 저장
    verbose=1                 # 저장 시 메시지 출력
)
# 모델 훈련, 훈련할 때마다 가장 좋은 모델을 저장함
df_Model=Model()
df_Model.compile(optimizer = tf.keras.optimizers.Adam(), 
                 loss = 'mse', 
                 metrics = tf.keras.metrics.RootMeanSquaredError())

df_hist = df_Model.fit(train_x, 
                       train_y, 
                       epochs = 1000, 
                       validation_data = (test_x, test_y), 
                       callbacks=[callback,checkpoint_callback])
