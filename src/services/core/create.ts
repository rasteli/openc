import fs from "fs"
import inquirer from "inquirer"
import { colors } from "../../tokens/colors"
import { exec, spawn } from "child_process"

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

  const child = spawn(
    `cd ${www} && npm create vite@latest ${answers.projectName}`,
    {
      stdio: "inherit",
      shell: true
    }
  )

  child.on("exit", code => {
    if (code === 0) {
      console.log(
        `${colors.green}Project created at ${colors.cyan}${www}/${answers.projectName}${colors.reset}`
      )
    }
  })
}

export async function createNextProject({ www }: CreateProjectParams) {
  const answers = await inquirer.prompt<CreateProjectAnswers["next"]>({
    type: "list",
    name: "nextVersion",
    message: "Next version:",
    choices: ["latest", "canary", "v12"]
  })

  spawn(`cd ${www} && npx create-next-app@${answers.nextVersion}`, {
    stdio: "inherit",
    shell: true
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

  fs.mkdirSync(`${www}/${answers.projectName}`)
  const child = exec(
    `cd ${www}/${answers.projectName} && ${initCmd[answers.packageManager]}`
  )

  child.on("exit", code => {
    if (code === 0) {
      console.log(
        `${colors.green}Project created at ${colors.cyan}${www}/${answers.projectName}${colors.reset}`
      )
    }
  })
}
