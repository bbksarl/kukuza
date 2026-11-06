import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EllipsisVertical, Eye, Pencil, Search, Trash2 } from 'lucide-react';
import Tabs, { Tab } from '../common/Tabs';
import Pagination from '../common/Pagination';
import type { Product, ProductEditInput, ProductFilter } from '../../types';
import { PRODUCT_CATEGORIES } from '../../utils/productForm';
import { useLanguage } from '@/core/i18n';

const ITEMS_PER_PAGE = 6;

interface ProductsTableProps {
  products: Product[];
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateProduct: (productId: string, changes: ProductEditInput) => Promise<void>;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, onDeleteProduct, onUpdateProduct }) => {
  const { t, translateCatalogLabel } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | null>(null);
  const [editValues, setEditValues] = useState({ name: '', category: '', price: '', quantity: '', gender: '', ageRange: '' });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const tabs: Tab[] = [
    { id: 'all', label: t('shop.tabProducts'), count: products.length },
    { id: 'in_stock', label: t('shop.inStock'), count: products.filter(p => p.status === 'in_stock').length },
    { id: 'low_stock', label: t('shop.lowStock'), count: products.filter(p => p.status === 'low_stock').length },
    { id: 'out_of_stock', label: t('shop.outOfStock'), count: products.filter(p => p.status === 'out_of_stock').length }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesStatus = activeTab === 'all' || product.status === activeTab;
      
      const matchesSearch = searchQuery === '' || 
        product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [products, activeTab, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (!editImage) return undefined;
    const previewUrl = URL.createObjectURL(editImage);
    setEditImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [editImage]);

  useEffect(() => {
    if (!openMenuId) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.product-action-menu, .product-action-trigger')) {
        setOpenMenuId(null);
        setMenuPosition(null);
      }
    };
    const closeMenu = () => {
      setOpenMenuId(null);
      setMenuPosition(null);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [openMenuId]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return <span className="badge-success">{t('shop.inStock')}</span>;
      case 'out_of_stock':
        return <span className="badge-error">{t('shop.outOfStock')}</span>;
      case 'low_stock':
        return <span className="badge-warning">{t('shop.lowStock')}</span>;
      default:
        return null;
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`${t('shop.confirmDeleteProduct')}\n${product.name}`)) return;
    setDeletingId(product.id);
    setDeleteError(null);
    try {
      await onDeleteProduct(product.id);
      setOpenMenuId(null);
      setMenuPosition(null);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : t('shop.deleteProductError'));
    } finally {
      setDeletingId(null);
    }
  };

  const openView = (product: Product) => {
    setDialogProduct(product);
    setDialogMode('view');
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const openEdit = (product: Product) => {
    setDialogProduct(product);
    setEditValues({
      name: product.name,
      category: product.category,
      price: String(product.price),
      quantity: String(product.stock),
      gender: product.gender ?? '',
      ageRange: product.ageRange ?? '',
    });
    setEditImage(null);
    setEditImagePreview(product.image ?? null);
    setEditError(null);
    setDialogMode('edit');
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  const closeDialog = () => {
    if (isSavingEdit) return;
    setDialogMode(null);
    setDialogProduct(null);
    setEditError(null);
    setEditImage(null);
    setEditImagePreview(null);
  };

  const saveEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!dialogProduct) return;
    const price = Number(editValues.price);
    const quantity = Number(editValues.quantity);
    if (!editValues.name.trim() || !editValues.category || !Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 0) {
      setEditError(t('shop.invalidEditProduct'));
      return;
    }
    if (editImage && (!['image/jpeg', 'image/png', 'image/webp'].includes(editImage.type) || editImage.size > 5 * 1024 * 1024)) {
      setEditError(t('shop.invalidEditImage'));
      return;
    }
    setIsSavingEdit(true);
    setEditError(null);
    try {
      await onUpdateProduct(dialogProduct.id, {
        name: editValues.name.trim(),
        category: editValues.category,
        price,
        quantity,
        gender: editValues.gender || undefined,
        ageRange: editValues.ageRange || undefined,
        image: editImage ?? undefined,
      });
      setDialogMode(null);
      setDialogProduct(null);
      setEditImage(null);
      setEditImagePreview(null);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : t('shop.updateProductError'));
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>, productId: string) => {
    if (openMenuId === productId) {
      setOpenMenuId(null);
      setMenuPosition(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const menuWidth = 168;
    const menuHeight = 128;
    const top = bounds.bottom + menuHeight + 8 <= window.innerHeight
      ? bounds.bottom + 6
      : Math.max(8, bounds.top - menuHeight - 6);
    const left = Math.max(8, Math.min(window.innerWidth - menuWidth - 8, bounds.right - menuWidth));
    setMenuPosition({ top, left });
    setOpenMenuId(productId);
  };

  return (
    <section className="dashboard-products-section shop-products-panel">
      {deleteError && <div role="alert" className="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{deleteError}</div>}
      <div className="shop-products-toolbar">
        <div className="dashboard-product-tabs">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as ProductFilter)}
          />
        </div>
        <div className="shop-products-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('shop.search')}
            aria-label={t('shop.search')}
          />
        </div>
      </div>

      <div className="table-container overflow-x-auto table-responsive">
          <table className="table shop-products-table">
          {paginatedProducts.length > 0 && <thead>
            <tr>
              <th className="text-xs md:text-sm">{t('shop.references')}</th>
              <th className="hidden sm:table-cell text-xs md:text-sm">{t('shop.product')}</th>
              <th className="hidden md:table-cell text-xs md:text-sm">{t('shop.productCategories')}</th>
              <th className="text-xs md:text-sm">{t('shop.quantityShort')}</th>
              <th className="hidden lg:table-cell text-xs md:text-sm">{t('shop.stockStatus')}</th>
              <th className="text-xs md:text-sm">{t('shop.action')}</th>
            </tr>
          </thead>}
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-(--color-text-secondary) text-sm">
                  {searchQuery ? t('shop.noProductsSearch') : t('shop.noProducts')}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td className="font-medium text-xs md:text-sm">{product.reference}</td>
                  <td className="hidden sm:table-cell">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-(--color-secondary) flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src="/assets/mVentes/im1.png"
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="text-xs md:text-sm truncate">{product.name}</span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell text-xs md:text-sm text-(--color-text-secondary)">{product.category}</td>
                  <td className="font-medium text-xs md:text-sm">{product.stock}</td>
                  <td className="hidden lg:table-cell text-xs md:text-sm">{getStatusBadge(product.status)}</td>
                  <td>
                    <div className="product-action-cell">
                    <button
                      className="icon-btn product-action-trigger"
                      type="button"
                      title={t('shop.moreOptions')}
                      aria-label={t('shop.moreOptions')}
                      aria-expanded={openMenuId === product.id}
                      disabled={deletingId === product.id}
                      onClick={(event) => toggleMenu(event, product.id)}
                    >
                      <EllipsisVertical size={16} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="px-3 md:px-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredProducts.length}
          />
          </div>
        )}
      </div>
      {openMenuId && menuPosition && typeof document !== 'undefined' && createPortal(
        <div
          className="product-action-menu product-action-menu-portal"
          role="menu"
          aria-label={`${t('shop.action')} ${products.find((product) => product.id === openMenuId)?.name ?? ''}`}
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button type="button" role="menuitem" onClick={() => {
            const product = products.find((item) => item.id === openMenuId);
            if (product) openView(product);
          }}><Eye size={15} />{t('shop.viewProduct')}</button>
          <button type="button" role="menuitem" onClick={() => {
            const product = products.find((item) => item.id === openMenuId);
            if (product) openEdit(product);
          }}><Pencil size={15} />{t('shop.editProduct')}</button>
          <button
            type="button"
            role="menuitem"
            className="product-action-delete"
            disabled={deletingId === openMenuId}
            onClick={() => {
              const product = products.find((item) => item.id === openMenuId);
              if (product) void handleDelete(product);
            }}
          >
            <Trash2 size={15} />{deletingId === openMenuId ? t('shop.deletingProduct') : t('shop.deleteProduct')}
          </button>
        </div>,
        document.body,
      )}
      {dialogMode && dialogProduct && createPortal(
        <div className="product-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
          {dialogMode === 'view' ? (
            <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-view-title">
              <div className="product-dialog-header">
                <div>
                  <p className="product-dialog-eyebrow">{dialogProduct.reference}</p>
                  <h2 id="product-view-title">{dialogProduct.name}</h2>
                </div>
                <button type="button" className="product-dialog-close" aria-label={t('shop.close')} onClick={closeDialog}>×</button>
              </div>
              {dialogProduct.image && <img className="product-dialog-image" src={dialogProduct.image} alt={dialogProduct.name} />}
              <dl className="product-dialog-details">
                <div><dt>{t('shop.itemCategory')}</dt><dd>{translateCatalogLabel(dialogProduct.category)}</dd></div>
                <div><dt>{t('shop.itemPrice')}</dt><dd>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(dialogProduct.price)}</dd></div>
                <div><dt>{t('shop.itemQuantity')}</dt><dd>{dialogProduct.stock}</dd></div>
                {dialogProduct.ageRange && <div><dt>{t('shop.ageRange')}</dt><dd>{translateCatalogLabel(dialogProduct.ageRange)}</dd></div>}
                {dialogProduct.gender && <div><dt>{t('shop.genderCategory')}</dt><dd>{translateCatalogLabel(dialogProduct.gender)}</dd></div>}
              </dl>
              <div className="product-dialog-actions">
                <button type="button" className="btn-secondary" onClick={closeDialog}>{t('shop.close')}</button>
                <button type="button" className="btn-primary" onClick={() => openEdit(dialogProduct)}><Pencil size={15} />{t('shop.editProduct')}</button>
              </div>
            </section>
          ) : (
            <form className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-edit-title" onSubmit={(event) => void saveEdit(event)}>
              <div className="product-dialog-header">
                <div>
                  <p className="product-dialog-eyebrow">{dialogProduct.reference}</p>
                  <h2 id="product-edit-title">{t('shop.editProductTitle')}</h2>
                </div>
                <button type="button" className="product-dialog-close" aria-label={t('shop.close')} onClick={closeDialog}>×</button>
              </div>
              <div className="product-edit-image">
                {editImagePreview ? <img src={editImagePreview} alt={dialogProduct.name} /> : <div className="product-edit-image-empty">{t('shop.noImage')}</div>}
                <label className="product-edit-image-picker">
                  {t('shop.changeProductImage')}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    aria-label={t('shop.changeProductImage')}
                    onChange={(event) => setEditImage(event.currentTarget.files?.[0] ?? null)}
                  />
                </label>
                <p>{t('shop.editImageFormats')}</p>
              </div>
              <div className="product-edit-grid">
                <label>{t('shop.itemName')}<input required value={editValues.name} onChange={(event) => setEditValues((current) => ({ ...current, name: event.target.value }))} /></label>
                <label>{t('shop.itemCategory')}<select required value={editValues.category} onChange={(event) => setEditValues((current) => ({ ...current, category: event.target.value }))}>
                  {[...new Set([editValues.category, ...PRODUCT_CATEGORIES].filter(Boolean))].map((category) => <option key={category} value={category}>{translateCatalogLabel(category)}</option>)}
                </select></label>
                <label>{t('shop.itemPrice')}<input required type="number" min="0" step="1" value={editValues.price} onChange={(event) => setEditValues((current) => ({ ...current, price: event.target.value }))} /></label>
                <label>{t('shop.itemQuantity')}<input required type="number" min="0" step="1" value={editValues.quantity} onChange={(event) => setEditValues((current) => ({ ...current, quantity: event.target.value }))} /></label>
                <label>{t('shop.ageRange')}<select value={editValues.ageRange} onChange={(event) => setEditValues((current) => ({ ...current, ageRange: event.target.value }))}>
                  <option value="">—</option><option value="Adulte">{translateCatalogLabel('Adulte')}</option><option value="Enfant">{translateCatalogLabel('Enfant')}</option>
                </select></label>
                <label>{t('shop.genderCategory')}<select value={editValues.gender} onChange={(event) => setEditValues((current) => ({ ...current, gender: event.target.value }))}>
                  <option value="">—</option><option value="Femme">{translateCatalogLabel('Femme')}</option><option value="Homme">{translateCatalogLabel('Homme')}</option><option value="Unisexe">{translateCatalogLabel('Unisexe')}</option>
                </select></label>
              </div>
              {editError && <p role="alert" className="product-dialog-error">{editError}</p>}
              <div className="product-dialog-actions">
                <button type="button" className="btn-secondary" onClick={closeDialog} disabled={isSavingEdit}>{t('shop.cancel')}</button>
                <button type="submit" className="btn-primary" disabled={isSavingEdit}>{isSavingEdit ? t('shop.saving') : t('shop.save')}</button>
              </div>
            </form>
          )}
        </div>,
        document.body,
      )}
    </section>
  );
};

export default ProductsTable;
