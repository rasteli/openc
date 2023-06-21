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
  where: string
}

export async function createProject({ www }: CreateProjectParams) {
  const choices = [
    `${colors.cyan}Vite${colors.reset}`,
    `${colors.white}Next${colors.reset}`,
    `${colors.green}Node${colors.reset}`
  ] as const

  const cmds = {
    Vite: async (where: string) => await createViteProject({ www: where }),
    Next: async (where: string) => await createNextProject({ www: where }),
    Node: async (where: string) => await createNodeProject({ www: where })
  }

  const answers = await inquirer.prompt<CreateProjectAnswers>([
    {
      type: "list",
      name: "project",
      message: "Create project:",
      choices
    },
    {
      type: "input",
      name: "where",
      message: "Where?",
      default: www
    }
  ])

  // Remove colors from answer
  const project = answers.project.replace(
    /\x1b\[[0-9;]*m/g,
    ""
  ) as CreateProjectAnswers["project"]

  const createProjectFunction = cmds[project]
  await createProjectFunction(answers.where)
}
