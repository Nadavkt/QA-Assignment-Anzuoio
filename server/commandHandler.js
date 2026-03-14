// commandHandler.js

class CommandHandler {
  /**
   * Handle a command string and return a response string.
   * Example input: "PING"
   * Returns: "PONG", "OK", or "ERROR UNKNOWN_COMMAND"
   */
  handle(commandLine) {
    const trimmed = commandLine.trim();
    if (!trimmed) {
      return 'ERROR EMPTY_COMMAND';
    }

    const [command] = trimmed.split(/\s+/);

    switch (command) {
      case 'PING':
        return 'PONG';

      case 'SPAWN_ENEMY':
      case 'MOVE_PLAYER':
      case 'CHANGE_COLOR':
        return 'OK';

      default:
        return 'ERROR UNKNOWN_COMMAND';
    }
  }
}

module.exports = CommandHandler;

