import pyupbit
import pandas as pd
import datetime
from sklearn.preprocessing import MinMaxScaler ,RobustScaler
import numpy as np
import math
import os
import tensorflow as tf
from sklearn.metrics import mean_squared_error

# API 키 설정 (보안 주의)
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
# scaler = RobustScaler()
df[['close', 'volume']] = scaler.fit_transform(df[['close', 'volume']])
# print("data_scaling 결과")
# print(df.head())


# 데이터셋 함수 정의
def Dataset(Data, split_ratio):
    total_rows = len(Data)
    train_end_idx = int(total_rows * split_ratio)

    Data['date'] = pd.to_datetime(Data['date'])
    
    Train_Data = Data[['close', 'volume']].iloc[:train_end_idx].to_numpy()
    Test_Data = Data[['close', 'volume']].iloc[train_end_idx:].to_numpy()

    Data_Train = []
    for i in range(0, len(Train_Data) - 4, 5):
        Data_Train.append(Train_Data[i:i + 5])
    Data_Train_X = np.array(Data_Train[:-1]).reshape((-1, 5 * 2))
    Data_Train_Y = np.array([sequence[:, 0] for sequence in Data_Train[1:]]).reshape(-1)  # 1차원으로 변경

    Data_Test = []
    for i in range(0, len(Test_Data) - 4, 5):
        Data_Test.append(Test_Data[i:i + 5])
    Data_Test_X = np.array(Data_Test[:-1]).reshape((-1, 5 * 2))
    Data_Test_Y = np.array([sequence[:, 0] for sequence in Data_Test[1:]]).reshape(-1)  # 1차원으로 변경

    return Data_Train_X, Data_Train_Y, Data_Test_X, Data_Test_Y
    

# 데이터셋을 train과 test로 분할
train_test_split_ratio = 0.9
train_x, train_y, test_x, test_y = Dataset(df, train_test_split_ratio)


############################## SVM 모델 정의 ###########################################
from sklearn.svm import SVR

from sklearn.svm import SVR

# SVM 모델 정의 및 훈련
svm_model = SVR(kernel='rbf', C=100, gamma=0.1, epsilon=0.1)
svm_model.fit(train_x, train_y)

# 예측 수행
svm_predictions = svm_model.predict(test_x)

# 스케일 원복
pred_df = pd.DataFrame(np.zeros((len(svm_predictions), 2)), columns=["close", "volume"])
pred_df['close'] = svm_predictions  # 예측 결과를 설정
prediction_scaled = scaler.inverse_transform(pred_df)[:, 0]

############################# linear regression 모델 정의 ################################
from sklearn.linear_model import LinearRegression

# 선형 회귀 모델 정의 및 훈련
lr_model = LinearRegression()
lr_model.fit(train_x, train_y)

# 예측 수행
lr_predictions = lr_model.predict(test_x)

# 스케일 원복
pred_df['close'] = lr_predictions  # 예측 결과를 설정
lr_prediction_scaled = scaler.inverse_transform(pred_df)[:, 0]

# 실제 값 스케일 원복
df_original = pyupbit.get_ohlcv("KRW-BTC", interval='day', count=days_count)
df_original['date'] = df_original.index.strftime('%Y-%m-%d')
actual_values = df_original['close'][df['date'] >= '2023-10-27'][:-6].to_numpy()

# SVM 예측 오차 계산
svm_actual_values = actual_values[:len(prediction_scaled)]
svm_mse = mean_squared_error(svm_actual_values, prediction_scaled)
svm_rmse = math.sqrt(svm_mse)
print(f"SVM Mean Squared Error: {svm_mse}")
print(f"SVM Root Mean Squared Error: {svm_rmse}")

# 선형 회귀 예측 오차 계산
lr_actual_values = actual_values[:len(lr_prediction_scaled)]
lr_mse = mean_squared_error(lr_actual_values, lr_prediction_scaled)
lr_rmse = math.sqrt(lr_mse)
print(f"Linear Regression Mean Squared Error: {lr_mse}")
print(f"Linear Regression Root Mean Squared Error: {lr_rmse}")


