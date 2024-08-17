import { describe, expect, it } from '@jest/globals'
import { executableNitroFile } from './execute'
import { GpuSetting } from '@janhq/core'
import { sep } from 'path'

let testSettings: GpuSetting = {
  run_mode: 'cpu',
  vulkan: false,
  cuda: {
    exist: false,
    version: '11',
  },
  gpu_highest_vram: '0',
  gpus: [],
  gpus_in_use: [],
  is_initial: false,
  notify: true,
  nvidia_driver: {
    exist: false,
    version: '11',
  },
}
const originalPlatform = process.platform

describe('test executable nitro file', () => {
  afterAll(function () {
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
    })
  })

  it('executes on MacOS', () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    })
    Object.defineProperty(process, 'arch', {
      value: 'arm64',
    })
    expect(executableNitroFile(testSettings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`mac-arm64${sep}cortex-cpp`),
        cudaVisibleDevices: '',
        vkVisibleDevices: '',
      })
    )
    Object.defineProperty(process, 'arch', {
      value: 'amd64',
    })
    expect(executableNitroFile(testSettings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`mac-amd64${sep}cortex-cpp`),
        cudaVisibleDevices: '',
        vkVisibleDevices: '',
      })
    )
  })

  it('executes on Windows CPU', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'cpu',
      cuda: {
        exist: true,
        version: '11',
      },
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`win-cpu${sep}cortex-cpp.exe`),
        cudaVisibleDevices: '',
        vkVisibleDevices: '',
      })
    )
  })

  it('executes on Windows Cuda 11', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'gpu',
      cuda: {
        exist: true,
        version: '11',
      },
      nvidia_driver: {
        exist: true,
        version: '12',
      },
      gpus_in_use: ['0'],
      gpus: [
        {
          id: '0',
          name: 'NVIDIA GeForce GTX 1080',
          vram: '80000000',
        },
      ],
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`win-cuda-11-7${sep}cortex-cpp.exe`),
        cudaVisibleDevices: '0',
        vkVisibleDevices: '0',
      })
    )
  })

  it('executes on Windows Cuda 12', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'gpu',
      cuda: {
        exist: true,
        version: '12',
      },
      nvidia_driver: {
        exist: true,
        version: '12',
      },
      gpus_in_use: ['0'],
      gpus: [
        {
          id: '0',
          name: 'NVIDIA GeForce GTX 1080',
          vram: '80000000',
        },
      ],
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`win-cuda-12-0${sep}cortex-cpp.exe`),
        cudaVisibleDevices: '0',
        vkVisibleDevices: '0',
      })
    )
  })

  it('executes on Linux CPU', () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'cpu',
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`linux-cpu${sep}cortex-cpp`),
        cudaVisibleDevices: '',
        vkVisibleDevices: '',
      })
    )
  })

  it('executes on Linux Cuda 11', () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'gpu',
      cuda: {
        exist: true,
        version: '11',
      },
      nvidia_driver: {
        exist: true,
        version: '12',
      },
      gpus_in_use: ['0'],
      gpus: [
        {
          id: '0',
          name: 'NVIDIA GeForce GTX 1080',
          vram: '80000000',
        },
      ],
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`linux-cuda-11-7${sep}cortex-cpp`),
        cudaVisibleDevices: '0',
        vkVisibleDevices: '0',
      })
    )
  })

  it('executes on Linux Cuda 12', () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    })
    const settings: GpuSetting = {
      ...testSettings,
      run_mode: 'gpu',
      cuda: {
        exist: true,
        version: '12',
      },
      nvidia_driver: {
        exist: true,
        version: '12',
      },
      gpus_in_use: ['0'],
      gpus: [
        {
          id: '0',
          name: 'NVIDIA GeForce GTX 1080',
          vram: '80000000',
        },
      ],
    }
    expect(executableNitroFile(settings)).toEqual(
      expect.objectContaining({
        executablePath: expect.stringContaining(`linux-cuda-12-0${sep}cortex-cpp`),
        cudaVisibleDevices: '0',
        vkVisibleDevices: '0',
      })
    )
  })
})
