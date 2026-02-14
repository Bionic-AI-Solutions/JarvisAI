// Shell completion feature placeholder
export function getBashCompletion(): string {
  return `
_jarvis_completion() {
  local cur prev opts
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"
  opts="create delete update list help"
  
  if [[ \${cur} == -* ]] ; then
    COMPREPLY=( $(compgen -W "\${opts}" -- \${cur}) )
  fi
}
complete -o bashdefault -o default -o nospace -F _jarvis_completion jarvis
`;
}

export function getZshCompletion(): string {
  return `
#compdef jarvis

_jarvis_commands() {
  local commands=(
    'create:Create a new resource'
    'delete:Delete resource'
    'update:Update existing resource'
    'list:List resources'
    'help:Show help'
  )
  _describe 'command' commands
}

_jarvis_completion() {
  _jarvis_commands
}

_jarvis_completion
`;
}
