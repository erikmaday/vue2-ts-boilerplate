import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { HttpService } from './HttpService'

jest.mock('axios')

type TestResponseType = {
  testResponseProp: string
}

type TestRequestType = {
  testRequestProp: string
}

describe('HttpService', () => {
  let httpService: HttpService
  let mockedGet: jest.Mock
  let mockedPost: jest.Mock
  let mockedPatch: jest.Mock
  let mockedDelete: jest.Mock

  beforeEach(() => {
    httpService = new HttpService()
    jest.resetAllMocks()
    mockedGet = axios.get as jest.Mock
    mockedDelete = axios.delete as jest.Mock
    mockedPost = axios.post as jest.Mock
    mockedPatch = axios.patch as jest.Mock
  })

  it('should make GET calls without config', async () => {
    const url = 'url'
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedGet.mockResolvedValueOnce(testResponse)

    const result = await httpService.get<TestResponseType, TestRequestType>(url)
    expect(axios.get).toHaveBeenCalledWith(url, undefined)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make GET calls with config', async () => {
    const url = 'url'
    const config = {} as unknown as AxiosRequestConfig
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedGet.mockResolvedValueOnce(testResponse)

    const result = await httpService.get<TestResponseType, TestRequestType>(
      url,
      config
    )
    expect(axios.get).toHaveBeenCalledWith(url, config)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make DELETE calls without config', async () => {
    const url = 'url'
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedDelete.mockResolvedValueOnce(testResponse)

    const result = await httpService.delete<TestResponseType, TestRequestType>(
      url
    )
    expect(axios.delete).toHaveBeenCalledWith(url, undefined)
    expect(axios.delete).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make DELETE calls with config', async () => {
    const url = 'url'
    const config = {} as unknown as AxiosRequestConfig
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedDelete.mockResolvedValueOnce(testResponse)

    const result = await httpService.delete<TestResponseType, TestRequestType>(
      url,
      config
    )
    expect(axios.delete).toHaveBeenCalledWith(url, config)
    expect(axios.delete).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make POST calls without config', async () => {
    const url = 'url'
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedPost.mockResolvedValueOnce(testResponse)

    const testRequest: TestRequestType = {
      testRequestProp: '42',
    }
    const result = await httpService.post<TestResponseType, TestRequestType>(
      url,
      testRequest
    )
    expect(axios.post).toHaveBeenCalledWith(url, testRequest, undefined)
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make POST calls with config', async () => {
    const url = 'url'
    const config = {} as unknown as AxiosRequestConfig
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedPost.mockResolvedValueOnce(testResponse)

    const testRequest: TestRequestType = {
      testRequestProp: '42',
    }
    const result = await httpService.post<TestResponseType, TestRequestType>(
      url,
      testRequest,
      config
    )
    expect(axios.post).toHaveBeenCalledWith(url, testRequest, config)
    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make PATCH calls without config', async () => {
    const url = 'url'
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedPatch.mockResolvedValueOnce(testResponse)

    const testRequest: TestRequestType = {
      testRequestProp: '42',
    }
    const result = await httpService.patch<TestResponseType, TestRequestType>(
      url,
      testRequest
    )
    expect(axios.patch).toHaveBeenCalledWith(url, testRequest, undefined)
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })

  it('should make PATCH calls with config', async () => {
    const url = 'url'
    const config = {} as unknown as AxiosRequestConfig
    const testResponse: AxiosResponse<TestResponseType> = {
      status: 200,
      headers: {},
      statusText: '',
      config: {},
      data: {
        testResponseProp: '42',
      },
    }
    mockedPatch.mockResolvedValueOnce(testResponse)

    const testRequest: TestRequestType = {
      testRequestProp: '42',
    }
    const result = await httpService.patch<TestResponseType, TestRequestType>(
      url,
      testRequest,
      config
    )
    expect(axios.patch).toHaveBeenCalledWith(url, testRequest, config)
    expect(axios.patch).toHaveBeenCalledTimes(1)
    expect(result.data.testResponseProp).toBe('42')
  })
})
