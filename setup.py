from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in tianjy_tree_table_multiselect/__init__.py
from tianjy_tree_table_multiselect import __version__ as version

setup(
	name="tianjy_tree_table_multiselect",
	version=version,
	description="tianjy_tree_table_multiselect",
	author="tianjy",
	author_email="511055984@qq.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
