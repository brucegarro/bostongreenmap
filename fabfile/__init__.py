from __future__ import unicode_literals
from fabric.operations import local, run
from fabric.api import env, task

from . import install

# env.user = 'bruce'
# env.code = '/home/%s/Machines/fullstackcoder' % env.user
# env.branch = 'master'

@task
def localhost():
	env.user = 'nanmeng'
	env.code = '/Users/%s/projects/pythonenv/bostongreenmap/client' % env.user
	env.run = local
	env.hosts = ['localhost']
