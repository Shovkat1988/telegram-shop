const compareArrays = (arr1, arr2) => {
  // Проверяем, имеют ли массивы одинаковую длину
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Создаем копии массивов и сортируем их
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  // Сравниваем отсортированные массивы
  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

export default compareArrays;
