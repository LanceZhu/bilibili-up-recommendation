#!/usr/bin/python
# -*- coding: UTF-8 -*-
import sys
import collections

# 读取文件
fn = open('./data/{}.txt'.format(sys.argv[1])) # 打开文件
string_data = fn.read() # 读出整个文件
fn.close() # 关闭文件

list = string_data.split( )

word_counts = collections.Counter(list) # 词频统计
word_counts_top100 = word_counts.most_common(100) # 获取前100最高频的词
print (str(word_counts_top100).decode("string_escape")) # 输出检查