N,K = gets.split.map(&:to_i)
grid = N.times.map {gets.split.map(&:to_i)}
lottery = gets.split.map(&:to_i)

count = 0

# マークを付ける
N.times do |i|
    N.times do |j|
        grid[i][j] = 0 if lottery.include?(grid[i][j])
    end
end

# 行のビンゴをカウント
N.times do |i|
    count += 1 if grid[i].all? { |cell| cell == 0 }
end

# 列のビンゴをカウント
N.times do |j|
    bingo = true
    N.times do |i|
        unless grid[i][j] == 0
            bingo = false
            break
        end
    end
    count += 1 if bingo
end

# 斜めのビンゴをカウント（左上から右下）
bingo = true
N.times do |i|
    unless grid[i][i] == 0
        bingo = false
        break
    end
end
count += 1 if bingo

# 斜めのビンゴをカウント（右上から左下）
bingo = true
N.times do |i|
    unless grid[i][N-1-i] == 0
        bingo = false
        break
    end
end
count += 1 if bingo

puts count