import chalk from "chalk";

export class Logger {
  constructor(private verbose: boolean = false) {}

  info(message: string) {
    if (this.verbose) {
      console.log(chalk.blue(message));
    }
  }

  success(message: string) {
    if (this.verbose) {
      console.log(chalk.green(message));
    }
  }

  warn(message: string) {
    if (this.verbose) {
      console.log(chalk.yellow(message));
    }
  }

  error(message: string) {
    if (this.verbose) {
      console.log(chalk.red(message));
    }
  }
}
