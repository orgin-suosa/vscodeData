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