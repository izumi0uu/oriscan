/**
 * 环境配置文件
 * 
 * 这个文件定义了应用程序的环境变量和运行环境信息，
 * 帮助我们区分代码是在服务器上运行还是在浏览器中运行，
 * 以及是在开发环境还是生产环境中运行。
 */

/**
 * isServer - 判断当前代码是否在服务器上运行
 * 
 * 在服务器端，'window'对象不存在，所以typeof window会返回'undefined'。
 * 如果这个条件为真，那么代码正在服务器上运行。
 * 
 * 想象一下：当你访问网站时，有些代码是在远程电脑（服务器）上运行的，
 * 有些代码是在你自己的电脑（浏览器）上运行的。这个变量帮助我们区分这两种情况。
 */
const isServer = 'undefined' === typeof window

/**
 * isBrowser - 判断当前代码是否在浏览器中运行
 * 
 * 这个变量是isServer的反义，如果代码不是在服务器上运行，
 * 那么它就是在浏览器中运行的。
 */
const isBrowser = !isServer

/**
 * isTest - 判断当前是否在开发环境中运行
 * 
 * 通过检查环境变量NEXT_PUBLIC_ENV是否等于'development'来确定。
 * 这个变量帮助我们在开发时使用测试API，在生产环境中使用正式API。
 * 
 * 小朋友可以理解为：这就像是区分"练习本"和"正式作业本"，
 * 在练习本上我们可以随意涂写测试，但在正式作业本上要认真完成。
 */
export const isTest = process.env.NEXT_PUBLIC_ENV === 'development'

// 在控制台打印环境信息，帮助开发者调试
console.log('isTest', isTest)
console.log('process.env.ENV', process.env.NEXT_PUBLIC_ENV)

/**
 * backend - API后端服务的URL地址
 * 
 * 根据是否处于测试环境，选择不同的API服务器地址：
 * - 测试环境使用测试服务器：'https://tests.ordinalscan.net/api'
 * - 生产环境使用正式服务器：'https://ordinalscan.net/api'
 * 
 * 这就像是有两个邮局，一个是测试用的邮局，我们可以在那里练习寄信；
 * 另一个是真正的邮局，我们要把重要的信件寄到那里。
 */
// 注释掉的代码是旧版API地址，已不再使用
// const backend = isTest ? 'https://tests.nav.ordinalscan.net/api/' : 'https://nav.ordinalscan.net/api/'
const backend = isTest ? 'https://tests.ordinalscan.net/api' : 'https://ordinalscan.net/api'

// 在控制台打印后端API地址，帮助开发者确认正在使用的服务器
console.log('backend', backend)

/**
 * ENV - 导出环境变量对象
 * 
 * 这个对象汇总了所有重要的环境变量，方便在应用的其他部分导入使用。
 * 它包含了：
 * - isBrowser: 是否在浏览器中运行
 * - isServer: 是否在服务器上运行
 * - backend: API后端服务的URL地址
 * 
 * 通过统一导出这些变量，其他文件只需导入这一个对象，
 * 就能获取所有环境相关的信息，使代码更整洁。
 */
export const ENV = {
  isBrowser,
  isServer,
  backend,
}
