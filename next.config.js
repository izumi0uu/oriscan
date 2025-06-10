/**
 * Next.js配置文件
 * 
 * 这个文件包含了Next.js项目的各种配置选项，控制着网站的构建、部署和运行方式。
 * 配置选项可以让我们自定义网站的行为，比如如何处理图片、设置请求头信息、配置路由等。
 * 
 * @type {import('next').NextConfig} - 这行是TypeScript类型注解，告诉编辑器这个对象的类型是Next.js的配置对象
 */
const nextConfig = {
  /**
   * output: 'standalone' - 构建输出模式设置
   * 
   * 这个设置告诉Next.js以"独立模式"构建应用。
   * 在独立模式下，构建过程会创建一个包含所有必要文件的独立文件夹，
   * 使得部署更加简单，不需要依赖node_modules文件夹。
   * 这对于使用Docker容器部署特别有用，可以减小镜像大小。
   */
  output: 'standalone',
  
  /**
   * experimental - 实验性功能配置
   * 
   * 这里启用了Next.js的一些实验性功能。
   * appDir: true - 启用了应用程序目录功能（App Router），这是Next.js的新一代路由系统。
   * App Router允许使用基于文件夹的路由方式，支持共享布局、嵌套路由等高级功能。
   * 小朋友可以把它想象成一本书的目录，帮助我们在不同的页面之间跳转。
   */
  experimental: {
    appDir: true,
  },

  /**
   * images - 图片处理配置
   * 
   * Next.js提供了内置的图像优化功能，可以自动调整大小、优化和提供现代图像格式。
   * remotePatterns - 定义允许从哪些外部域名加载图片
   * 这里配置允许从'api.hiro.so'域名通过HTTPS协议加载图片。
   * 
   * 想象一下，这就像是告诉网站："你只能从这个特定的图片商店拿照片，不能从其他地方拿"。
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.hiro.so',
      },
    ],
  },

  /**
   * headers - HTTP响应头配置
   * 
   * 这个函数设置网站的HTTP响应头信息。
   * '/:path*' - 表示适用于网站的所有路径
   * 'Access-Control-Allow-Origin': '*' - 允许任何网站通过AJAX请求访问此站点的资源
   * 
   * 这就像是在告诉浏览器："任何人都可以借用我网站上的东西，我不设防"。
   * 在开发环境中这很方便，但在生产环境中可能需要更严格的设置以提高安全性。
   */
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ]
  },

  /**
   * redirects - 重定向配置
   * 
   * 这个函数设置URL重定向规则。
   * 当用户访问'/content/:iid'时，会被重定向到API服务器上对应的内容URL。
   * ':iid'是一个动态参数，代表铭文(inscription)的ID。
   * permanent: false - 表示这是一个临时重定向(HTTP 307)，而不是永久重定向(HTTP 301)
   * 
   * 举个例子：如果有人想看铭文编号为"123"的内容，访问'/content/123'，
   * 网站会自动把他带到'https://api.hiro.so/inscriptions/123/content'这个地址。
   * 就像是一个自动门，把访客引导到正确的房间。
   */
  redirects: async () => {
    return [
      {
        source: '/content/:iid',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/inscriptions/:iid/content`,
        permanent: false,
      },
    ]
  },
}

// 导出配置对象，让Next.js应用使用这些设置
module.exports = nextConfig
