$2 supervisorctl stop "$1" ; $2 rm -rf "$3" ; $2 rm -rf "$4"
$2 supervisorctl reload