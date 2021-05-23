#!/bin/bash
# 此文件的功能将使用阿里云“流水线”功能代替
## vercel 在构建之前执行的脚步（需要在后台配置） - https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
## 由于本项目仅仅只是博客主题，所以在博客内容更新时需要将内容更新到本地进行构建

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

PWD=$(pwd)
# 内容远程存储库地址
REMOTE_GIT=git@codeup.aliyun.com:5f03f01799f4b36b1784638c/laeni/blog-content.git
# 本地博客内容存放目录
CONTENT_DIR=./content
DEPTH=2

# 克隆
function clone() {
  git clone --depth=$DEPTH $REMOTE_GIT $CONTENT_DIR
}
# 拉取
function pull() {
  cd $PWD/$CONTENT_DIR
  # 获取远程更新
  git fetch --depth=$DEPTH --progress origin
  # 重置 HEAD、索引和工作区 为 origin/master
  git reset --hard origin/master
  cd "$PWD"
}

# 拉取或克隆博客内容
function get_blog_content() {
  contentPath=$PWD/content

  #这里的-x 参数判断$myPath是否存在并且是否具有可执行权限
  if [[ ! -x "$contentPath" ]] ; then
    clone
  else
    pull
  fi
}
get_blog_content

if [[ "$VERCEL_GIT_COMMIT_REF" == "staging" || "$VERCEL_GIT_COMMIT_REF" == "master"  ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
