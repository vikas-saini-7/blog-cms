// components/blog-editor/CategoriesInput.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllCategories } from "@/actions/category.actions";

interface CategoriesInputProps {
  value: string[];
  onChange: (categories: string[]) => void;
}

const CategoriesInput: React.FC<CategoriesInputProps> = ({
  value,
  onChange,
}) => {
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const res = await getAllCategories();
      if (res.success && res.categories) {
        setAllCategories(res.categories.map((cat: any) => cat.name));
      } else {
        toast.error(res.message || "Failed to fetch categories");
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const toggleCategory = (category: string) => {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Categories</label>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading categories...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 text-sm rounded-full border ${
                value.includes(cat)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesInput;
