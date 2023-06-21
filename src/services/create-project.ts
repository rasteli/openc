import inquirer from "inquirer"
import { colors } from "../tokens/colors"
import {
  CreateProjectParams,
  createNextProject,
  createNodeProject,
  createViteProject
} from "./core/create"

interface CreateProjectAnswers {
  project: "Vite" | "Next" | "Node"
}

export async function createProject({ www }: CreateProjectParams) {
  const choices = [
    `${colors.cyan}Vite${colors.reset}`,
    `${colors.white}Next${colors.reset}`,
    `${colors.green}Node${colors.reset}`
  ] as const

  const cmds = {
    Vite: async () => await createViteProject({ www }),
    Next: async () => await createNextProject({ www }),
    Node: async () => await createNodeProject({ www })
  }

  const answers = await inquirer.prompt<CreateProjectAnswers>({
    type: "list",
    name: "project",
    message: "Create project:",
    choices
  })

  // Remove colors from answer
  const project = answers.project.replace(
    /\x1b\[[0-9;]*m/g,
    ""
  ) as CreateProjectAnswers["project"]

  const createProjectFunction = cmds[project]
  await createProjectFunction()
}
