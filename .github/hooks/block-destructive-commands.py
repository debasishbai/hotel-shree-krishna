import json
import re
import sys


def get_command(event):
    tool_args = event.get("toolArgs", event.get("tool_input", {}))
    if isinstance(tool_args, str):
        try:
            tool_args = json.loads(tool_args)
        except json.JSONDecodeError:
            return tool_args

    if isinstance(tool_args, dict):
        command = tool_args.get("command", "")
        return command if isinstance(command, str) else ""

    return ""


def blocks_command(command):
    for segment in re.split(r"[;\n|&]+", command.lower()):
        tokens = segment.split()

        for index, token in enumerate(tokens):
            if token not in {"rm", "remove-item"}:
                continue

            if token == "remove-item":
                options = [
                    option.rstrip(",")
                    for option in tokens[index + 1 :]
                    if option.startswith("-")
                ]
                if (
                    any(option in {"-recurse", "-r"} for option in options)
                    and any(option in {"-force", "-fo"} for option in options)
                ):
                    return True
                continue

            options = []
            for option in tokens[index + 1 :]:
                if not option.startswith("-"):
                    break
                options.append(option.rstrip(","))

            short_flags = {
                flag
                for option in options
                if option.startswith("-") and not option.startswith("--")
                for flag in option[1:]
            }
            has_recursive_force = {"r", "f"}.issubset(short_flags)
            has_long_recursive_force = {"--recursive", "--force"}.issubset(options)

            if has_recursive_force or has_long_recursive_force:
                return True

    return False


def main():
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, UnicodeDecodeError):
        print("{}")
        return

    if blocks_command(get_command(event)):
        print(
            json.dumps(
                {
                    "permissionDecision": "deny",
                    "permissionDecisionReason": (
                        "Blocked recursive force-delete command pattern."
                    ),
                }
            )
        )
    else:
        print("{}")


if __name__ == "__main__":
    main()