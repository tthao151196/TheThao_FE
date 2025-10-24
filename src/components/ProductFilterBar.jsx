import { useEffect, useState } from "react";

/**
 * props:
 *  - value: { q, category_id, min_price, max_price, only_sale, in_stock, sort, page, per_page }
 *  - onChange(next)
 *  - categories: [{id, name}]
 *  - loading: boolean
 *  - onClear: () => void
 */
export default function ProductFilterBar({
    value,
    onChange,
    categories = [],
    loading = false,
    onClear,
}) {
    const [local, setLocal] = useState(value);

    useEffect(() => setLocal(value), [value]);

    const change = (patch) => {
        const next = { ...local, ...patch };
        setLocal(next);
        onChange?.(next);
    };

    return (
        <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${loading ? "opacity-70 pointer-events-none" : ""}`}>
            <div className="p-4 md:p-5 grid gap-3 md:gap-4 md:grid-cols-12">
                {/* TÃ¬m kiáº¿m */}
                <div className="md:col-span-4">
                    <label className="block text-sm text-gray-600 mb-1">TÃ¬m kiáº¿m</label>
                    <input
                        type="text"
                        value={local.q || ""}
                        onChange={(e) => change({ q: e.target.value, page: 1 })}
                        placeholder="Nháº­p tÃªn sáº£n pháº©m..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>

                {/* Danh má»¥c */}
                <div className="md:col-span-3">
                    <label className="block text-sm text-gray-600 mb-1">Danh má»¥c</label>
                    <select
                        value={local.category_id || ""}
                        onChange={(e) => change({ category_id: e.target.value || null, page: 1 })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">â€” Táº¥t cáº£ â€”</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Khoáº£ng giÃ¡ */}
                <div className="md:col-span-3">
                    <label className="block text-sm text-gray-600 mb-1">Khoáº£ng giÃ¡ (VNÄ)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            min={0}
                            value={local.min_price ?? ""}
                            onChange={(e) =>
                                change({ min_price: e.target.value ? Number(e.target.value) : null, page: 1 })
                            }
                            placeholder="Tá»«"
                            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="number"
                            min={0}
                            value={local.max_price ?? ""}
                            onChange={(e) =>
                                change({ max_price: e.target.value ? Number(e.target.value) : null, page: 1 })
                            }
                            placeholder="Äáº¿n"
                            className="w-1/2 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Sáº¯p xáº¿p */}
                <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">Sáº¯p xáº¿p</label>
                    <select
                        value={local.sort || "newest"}
                        onChange={(e) => change({ sort: e.target.value, page: 1 })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="newest">Má»›i nháº¥t</option>
                        <option value="price-asc">GiÃ¡ tháº¥p â†’ cao</option>
                        <option value="price-desc">GiÃ¡ cao â†’ tháº¥p</option>
                        <option value="name-asc">TÃªn A â†’ Z</option>
                        <option value="name-desc">TÃªn Z â†’ A</option>
                    </select>
                </div>

                {/* Toggle + Clear */}
                <div className="md:col-span-12 flex flex-wrap gap-4 items-center pt-1">
                    <label className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!local.only_sale}
                            onChange={(e) => change({ only_sale: e.target.checked, page: 1 })}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Chá»‰ sáº£n pháº©m giáº£m giÃ¡</span>
                    </label>

                    <label className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!local.in_stock}
                            onChange={(e) => change({ in_stock: e.target.checked, page: 1 })}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm">Chá»‰ cÃ²n hÃ ng</span>
                    </label>

                    <div className="ms-auto">
                        <button
                            onClick={() => onClear?.()}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            XoÃ¡ lá»c
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


