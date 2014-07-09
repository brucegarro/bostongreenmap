from fabric.api import env, task, run, sudo, put, cd

def npm_install():
	pass
    # sudo('apt-get install npm')
    # sudo('npm install')

def node_install():
    sudo('npm install n')
    sudo('n stable')

def grunt_install():
    sudo('npm install -g grunt-cli')
    sudo('npm install grunt')

def handlebars_install():
    sudo('sudo npm install handlebars -g')
    sudo('npm install grunt-contrib-handlebars --save-de')
    sudo('npm install grunt-contrib-compass --save-de')
    sudo('npm install grunt-contrib-watch --save-de')
    sudo('npm install grunt-contrib-connect --save-de')

def compass_install():
    # sudo('apt-get install -q -y ruby')
    # run('brew install -q -y ruby')
    # sudo('apt-get install rubygems')
    # run('brew install rubygems')
    # sudo('apt-get install gem -y')
    # run('brew install gem -y')
    sudo('gem install --no-ri --no-rdoc sass -v 3.2.13')
    sudo('gem install --no-ri --no-rdoc compass -v 0.12.2')

@task
def all():
    with cd(env.code):
        npm_install()
        node_install()
        grunt_install()
        handlebars_install()
        compass_install()
