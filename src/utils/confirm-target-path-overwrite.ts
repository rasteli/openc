import fs from "node:fs"
import inquirer from "inquirer"

interface ConfirmTargetPathOverwriteParams {
  path: string
  target: string
}

export async function confirmTargetPathOverwrite({
  path,
  target
}: ConfirmTargetPathOverwriteParams) {
  const confirm = await inquirer.prompt({
    type: "confirm",
    name: "overwrite",
    message: `Target directory "${target}" exits. Do you want to overwrite it?`,
    default: false
  })

  if (!confirm.overwrite) {
    process.exit(0)
  }

  fs.rmSync(path, { recursive: true, force: true })
}
