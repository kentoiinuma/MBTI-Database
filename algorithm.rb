クラスの学級委員である paiza 君は、クラスのみんなに次のような形式でアカウントの情報を送ってもらうよう依頼しました。

名前 年齢 誕生日 出身地

送ってもらったデータを使いやすいように整理したいと思った paiza 君はクラス全員分のデータを次の形式でまとめることにしました。

User{
nickname : 名前
old : 年齢
birth : 誕生日
state : 出身地
}


クラスメートの情報が与えられるので、それらを以上の形式でまとめたものを出力してください。
▼　下記解答欄にコードを記入してみよう

入力される値
N
n_1 o_1 b_1 s_1
...
n_N o_N b_N s_N


・ 1 行目では、paiza君のクラスの人数 N が与えられます。
・ 続く N 行のうち i 行目 (1 ≦ i ≦ N) では、 i 番の生徒の名前・年齢・誕生日・出身地を表す整数・文字列 n_i ,o_i ,b_i , s_i が順に半角スペース区切りで与えられます。

入力値最終行の末尾に改行が１つ入ります。
文字列は標準入力から渡されます。 標準入力からの値取得方法はこちらをご確認ください
期待する出力
User{
nickname : n_1
old : o_1
birth : b_1
state : s_1
}
User{
nickname : n_2
old : o_2
birth : b_2
state : s_2
}
...
User{
nickname : n_N
old : o_N
birth : b_N
state : s_N
}

番号が若い順に各クラスメートの情報を以上の形式でを出力してください。
条件
・ 1 ≦ N ≦ 10
・ n_i , s_i (1 ≦ i ≦ N) は 1 文字以上 20 文字以下の文字列
・ b_i (1 ≦ i ≦ N) はMM/DD 形式の文字列（例 1月2日 → 01/02 12月31日 → 12/31)
・ 1 ≦ o_i ≦ 100

入力例1
1
koko 23 04/10 tokyo

出力例1
User{
nickname : koko
old : 23
birth : 04/10
state : tokyo
}

入力例2
3
mako 13 08/08 nara
megumi 14 11/02 saitama
taisei 16 12/04 nagano

出力例2
User{
nickname : mako
old : 13
birth : 08/08
state : nara
}
User{
nickname : megumi
old : 14
birth : 11/02
state : saitama
}
User{
nickname : taisei
old : 16
birth : 12/04
state : nagano
}