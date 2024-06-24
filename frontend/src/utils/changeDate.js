import jsonData from './dummy.json';

const startDate = new Date("2015-01-01");

// 날짜 포맷을 변경하는 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 날짜를 증가시키면서 포맷을 변경하는 함수
function modifyDateIncrementally(index) {
  const newDate = new Date(startDate);
  newDate.setDate(newDate.getDate() + index);

  const formattedDate = formatDate(newDate);
  return formattedDate;
}

// 각 데이터의 날짜를 변경하고 숫자 값을 변환
export const modifiedData = jsonData.map((data, index) => {
  const formattedDate = modifyDateIncrementally(index);
  // 숫자 값을 쉼표 제거 후 숫자로 변환
  const newValues = data.slice(1).map(value => parseFloat(value.toString().replace(/,/g, '')));
  return [formattedDate, ...newValues];
});

// import jsonData from './dummy.json'

// const startDate = new Date("2015-02-17");

// // 날짜 포맷을 변경하는 함수
// function formatDate(date, prevDate) {
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함
//   const day = date.getDate();

//   const prevYear = prevDate.getFullYear();
//   const prevMonth = prevDate.getMonth() + 1;

//   if (year !== prevYear) {
//     return `${year}년`;
//   } else if (month !== prevMonth) {
//     return `${month}월`;
//   } else {
//     return `${day}일`;
//   }
// }

// // 날짜를 증가시키면서 포맷을 변경하는 함수
// function modifyDateIncrementally(index, prevDate) {
//   const newDate = new Date(startDate);
//   newDate.setDate(newDate.getDate() + index);

//   const formattedDate = formatDate(newDate, prevDate);
//   return { newDate, formattedDate };
// }

// // 이전 날짜를 저장할 변수 초기화
// let prevDate = new Date(startDate);

// // 각 데이터의 날짜를 변경하고 숫자 값을 변환
// export const modifiedData = jsonData.map((data, index) => {
//   const { newDate, formattedDate } = modifyDateIncrementally(index, prevDate);
//   prevDate = newDate;
//   // 숫자 값을 쉼표 제거 후 숫자로 변환
//   const newValues = data.slice(1).map(value => parseFloat(value.toString().replace(/,/g, '')));
//   return [formattedDate, ...newValues];
// });

// // 각 데이터의 날짜를 변경
// // export const modifiedData = jsonData.map((data, index) => modifyDateIncrementally(data, index));