import fs from "fs"
import inquirer from "inquirer"
import { colors } from "../../tokens/colors"
import { spawnProcess } from "../../utils/spawn-processs"
import { confirmTargetPathOverwrite } from "../../utils/confirm-target-path-overwrite"

export interface CreateProjectParams {
  www: string
}

interface CreateProjectAnswers {
  node: {
    projectName: string
    packageManager: "npm" | "yarn"
  }
  vite: {
    projectName: string
  }
  next: {
    projectName: string
    nextVersion: "latest" | "canary" | "v12"
  }
}

export async function createViteProject({ www }: CreateProjectParams) {
  const answers = await inquirer.prompt<CreateProjectAnswers["vite"]>({
    type: "input",
    name: "projectName",
    message: "Project name:",
    default: "vite-app"
  })

  const path = `${www}/${answers.projectName}`

  // create vite script already checks if the path exists
  // and asks for confirmation to overwrite it

  spawnProcess({
    cmd: `cd ${www} && npm create vite@latest ${answers.projectName} && code ${path}`,
    successMessage: `${colors.green}Project created at ${colors.cyan}${path}${colors.reset}`
  })
}

export async function createNextProject({ www }: CreateProjectParams) {
  const answers = await inquirer.prompt<CreateProjectAnswers["next"]>([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: "next-app"
    },
    {
      type: "list",
      name: "nextVersion",
      message: "Next version:",
      choices: ["latest", "canary", "v12"]
    }
  ])

  const path = `${www}/${answers.projectName}`

  if (fs.existsSync(path)) {
    await confirmTargetPathOverwrite({ path, target: answers.projectName })
  }

  spawnProcess({
    cmd: `cd ${www} && npx create-next-app@${answers.nextVersion} ${answers.projectName} && code ${path}`,
    successMessage: `${colors.green}Project created at ${colors.cyan}${path}${colors.reset}`
  })
}

export async function createNodeProject({ www }: CreateProjectParams) {
  const answers = await inquirer.prompt<CreateProjectAnswers["node"]>([
    {
      type: "input",
      name: "projectName",
      message: "Project name:",
      default: "node-app"
    },
    {
      type: "list",
      name: "packageManager",
      message: "Package manager:",
      choices: ["npm", "yarn"]
    }
  ])

  const initCmd = {
    npm: `npm init -y`,
    yarn: `yarn init -y`
  }

  const path = `${www}/${answers.projectName}`

  if (fs.existsSync(path)) {
    await confirmTargetPathOverwrite({ path, target: answers.projectName })
  }

  fs.mkdirSync(path)

  spawnProcess({
    cmd: `cd ${www}/${answers.projectName} && ${
      initCmd[answers.packageManager]
    } && code ${path}`,
    successMessage: `${colors.green}Project created at ${colors.cyan}${path}${colors.reset}`
  })
}
