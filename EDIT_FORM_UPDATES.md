# Edit Form Updates Needed

## Changes to make edit form match create form (SimpleProductForm.tsx)

### ✅ DONE:
1. Added FINISH_TYPES constant (37 options)
2. Added MATERIAL_TYPES constant (60+ options)

### ❌ TODO:

#### 1. Update Highlights Section (Lines 614-618)
**Current:** Only 4 highlights  
**Needed:** 6 highlights

**Add after line 617:**
```tsx
<input name="highlight5" defaultValue={product.highlights?.[4]} placeholder="Highlight 5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
<input name="highlight6" defaultValue={product.highlights?.[5]} placeholder="Highlight 6" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
```

#### 2. Update Material Dropdown (Lines 633-641)
**Current:** Only 5 hardcoded options  
**Needed:** Dynamic MATERIAL_TYPES mapping

**Replace lines 634-640 with:**
```tsx
<option value="">Select material</option>
{MATERIAL_TYPES.map((material) => (
  <option key={material} value={material}>
    {material}
  </option>
))}
```

#### 3. Update Finish Dropdown (Lines 646-653)
**Current:** Only 4 hardcoded options  
**Needed:** Dynamic FINISH_TYPES mapping

**Replace lines 647-652 with:**
```tsx
<option value="">Select finish</option>
{FINISH_TYPES.map((finish) => (
  <option key={finish} value={finish}>
    {finish}
  </option>
))}
```

#### 4. Add Product ID Field
**Location:** After line 659 (after Color field)

**Add:**
```tsx
{/* Product ID */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">Product ID</label>
  <input name="productId" defaultValue={product.productId} placeholder="SKU-001" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
</div>
```

#### 5. Replace Length/Width with Size Field (Lines 661-681)
**Current:** Separate Length, Width, Unit fields  
**Needed:** Single Size field

**Replace lines 661-681 with:**
```tsx
{/* Size */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-2">Size</label>
  <input name="size" defaultValue={product.size} placeholder="24x24, 1200x600mm, etc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all" />
</div>
```

#### 6. Update Form Submission Logic
**Find:** The handleSubmit function (around line 144)

**Add to form data extraction:**
```typescript
const productId = formData.get('productId') as string;
const size = formData.get('size') as string;
const highlight5 = formData.get('highlight5') as string;
const highlight6 = formData.get('highlight6') as string;
```

**Update highlights array:**
```typescript
const highlights = [highlight1, highlight2, highlight3, highlight4, highlight5, highlight6].filter(h => h);
```

**Remove:**
```typescript
const length = formData.get('length') as string;
const width = formData.get('width') as string;
const dimensionsObj: any = { unit };
if (length) dimensionsObj.length = Number(length);
if (width) dimensionsObj.width = Number(width);
```

**Add to requestBody:**
```typescript
if (productId) requestBody.productId = productId;
if (size) requestBody.size = size;
```

**Remove from requestBody:**
```typescript
if (length || width) requestBody.dimensions = JSON.stringify(dimensionsObj);
```

---

## Summary:
- ✅ Constants added
- ❌ 6 manual changes needed in the form JSX
- ❌ Form submission logic needs updates

**Total Changes:** 6 sections to update
