import fs from "fs"
import inquirer from "inquirer"
import { exec, spawn } from "child_process"
import { colors } from "../tokens/colors"

interface CreateProjectParams {
  www: string
}

interface CreateProjectAnswers {
  select: {
    project: "Vite" | "Next" | "Node"
  }
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

export async function createProject({ www }: CreateProjectParams) {
  const choices = [
    `${colors.cyan}Vite${colors.reset}`,
    `${colors.white}Next${colors.reset}`,
    `${colors.green}Node${colors.reset}`
  ] as const

  const cmds = {
    Vite: async () => {
      const answers = await inquirer.prompt<CreateProjectAnswers["vite"]>({
        type: "input",
        name: "projectName",
        message: "Project name:",
        default: "vite-app"
      })

      // Spawn an interactive shell session
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
    },
    Next: async () => {
      const answers = await inquirer.prompt<CreateProjectAnswers["next"]>({
        type: "list",
        name: "nextVersion",
        message: "Next version:",
        choices: ["latest", "canary", "v12"]
      })

      // Spawn an interactive shell session
      spawn(`cd ${www} && npx create-next-app@${answers.nextVersion}`, {
        stdio: "inherit",
        shell: true
      })
    },
    Node: async () => {
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
  }

  const answers = await inquirer.prompt<CreateProjectAnswers["select"]>({
    type: "list",
    name: "project",
    message: "Create project:",
    choices
  })

  // Remove colors from answer
  const project = answers.project.replace(
    /\x1b\[[0-9;]*m/g,
    ""
  ) as CreateProjectAnswers["select"]["project"]

  const createProjectFunction = cmds[project]
  await createProjectFunction()
}
