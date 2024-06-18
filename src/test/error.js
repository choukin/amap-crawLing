function myFunction() {
  try {
    // 这里放入可能会引发错误的代码
    throw new Error('我故意制造一个错误');
  } catch (error) {
    console.log(JSON.stringify(error)); // 输出完整的错误对象
    console.log(`错误类型：${error.name}`);
    console.log(`错误所在的文件名：${error.fileName}`);
    console.log(`错误所在的函数名：${error.funcName}`);
    console.log(`错误所在的行号：${error.lineNumber}`);
    console.log(`错误消息：${error.message}`);
    console.log(`🚀 ~ myFunction ~ error:`, error.stack);
    console.log(`🚀 ~ myFunction ~ error:`, typeof error.stack);
  }
}

myFunction();
