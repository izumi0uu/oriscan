import { Service } from 'ahooks/es/useRequest/src/types'

export default function R<T, P>(service: Service<T, [P]>, params: P): Service<T, []> {
  return async function () {
    return await service(params)
  }
}
