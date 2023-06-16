LCuser_OKRZMN: 
请用ts 实现输入描述的算法

输入描述:
输入： 第1行为n代表用户的个数 第2行为n个整数，第i个代表用户标号为i的用户对某类文章的喜好度 第3行为一个正整数q代表查询的组数  第4行到第（3+q）行，每行包含3个整数l,r,k代表一组查询，即标号为l<=i<=r的用户中对这类文章喜好值为k的用户的个数。 数据范围n <= 300000,q<=300000 k是整型

输出描述:
输出：一共q行，每行一个整数代表喜好值为k的用户的个数
AI回答: 
interface Query {
    l: number;
    r: number;
    k: number;
}

function countPreferedUsers(n: number, preferences: number[], queries: Query[]): number[] {
    // 构造线段树
    const tree: number[] = new Array(n * 4).fill(0);
    function build(node: number, left: number, right: number): void {
        if (left === right) {
            tree[node] = preferences[left - 1];
        } else {
            const mid = (left + right) >> 1;
            build(node << 1, left, mid);
            build(node << 1 | 1, mid + 1, right);
            tree[node] = tree[node << 1] + tree[node << 1 | 1];
        }
    }

    // 查询线段树
    function query(node: number, left: number, right: number, ql: number, qr: number, k: number): number {
        if (ql > right || qr < left) {
            return 0; // 节点区间与查询区间不交
        } else if (ql <= left && qr >= right) {
            return tree[node]; // 节点区间包含查询区间
        } else {
            const mid = (left + right) >> 1;
            return query(node << 1, left, mid, ql, qr, k) + query(node << 1 | 1, mid + 1, right, ql, qr, k);
        }
    }

    // 处理每个查询
    const result: number[] = [];
    for (const query of queries) {
        result.push(query(1, 1, n, query.l, query.r, query.k));
    }
    return result;
}

