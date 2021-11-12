#!/bin/bash

## Variables
hi="Hello World"

decqlare -a arr=("1" "2" "3")

arraylen=${#arr[@]}

## Action

echo $hi

for i in ${arr[@]}
do 
	echo "$i" / "$arraylen" : "${arr[$i-1]}"
done

> save.txt
