---
layout: layout           # 布局,默认为layout
title: {{ title }}       # 标题，默认为文章的文件名
comments: true           # 开启文章的评论功能，默认为true
date: {{ date }}         # 建立日期，默认为文件建立日期
updated: {{ date }}      # 更新日期，默认为文件建立日期
permalink:               # 覆盖文章网址
excerpt:                 # 纯文本的页面摘录。使用此插件格式化文本
tags:                    # 标签（不适用于分页），值为yaml的数组格式
categories:              # 分类（不适用于分页），值为yaml的数组格式
## 主题特有
toc: boolean             # 是否显示文章目录
no_toc: boolean          # 显示关闭文章目录
word_count: boolean      # 是否开启字数统计
no_word_count: boolean   # 显示关闭字数统计
reward: boolean          # 是否开启打赏
no_reward: boolean       # 显示关闭打赏
no_valine: boolean       # 显示关闭评论
no_minivaline: boolean   # 显示关闭迷你评论

---
