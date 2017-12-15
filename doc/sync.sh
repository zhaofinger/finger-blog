cd `dirname $0`
rsync -vzrtou --progress --exclude-from=.syncignore --password-file=.pwd ../ rsyncer@67.218.154.219::finger-blog;