import type { Environment } from 'vitest/environments'

export default <Environment>{
    name: 'prisma',
    transformMode: 'ssr',
    // optional - only if you support "experimental-vm" pool
    // async setupVM() {
    //   const vm = await import('node:vm')
    //   const context = vm.createContext()
    //   return {
    //     getVmContext() {
    //       return context
    //     },
    //     teardown() {
    //       // called after all tests with this env have been run
    //     }
    //   }
    // },
    setup() {
      // custom setup
      return {
        teardown() {
          // called after all tests with this env have been run
        }
      }
    }
  }