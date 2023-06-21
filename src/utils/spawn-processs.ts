import { spawn } from "node:child_process"

interface SpawnProcessParams {
  cmd: string
  cwd: string
  successMessage: string
}

export function spawnProcess({ cmd, cwd, successMessage }: SpawnProcessParams) {
  const child = spawn(cmd, {
    stdio: "inherit",
    shell: true,
    cwd
  })

  child.on("exit", code => {
    if (code === 0) {
      console.log(successMessage)
    }
  })
}
