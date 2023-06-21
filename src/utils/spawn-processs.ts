import { spawn } from "child_process"

interface SpawnProcessParams {
  cmd: string
  successMessage: string
}

export function spawnProcess({ cmd, successMessage }: SpawnProcessParams) {
  const child = spawn(cmd, {
    stdio: "inherit",
    shell: true
  })

  child.on("exit", code => {
    if (code === 0) {
      console.log(successMessage)
    }
  })
}
