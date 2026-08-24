import React, { useState, useMemo, useEffect } from 'react';
import { EllipsisVertical, Eye, Pencil } from 'lucide-react';
import Tabs, { Tab } from '../common/Tabs';
import Pagination from '../common/Pagination';
import type { Product, ProductFilter } from '../../types';
import { useLanguage } from '@/core/i18n';

const ITEMS_PER_PAGE = 6;

interface ProductsTableProps {
  products: Product[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const tabs: Tab[] = [
    { id: 'all', label: t('shop.tabProducts'), count: products.length },
    { id: 'in_stock', label: t('shop.inStock'), count: products.filter(p => p.status === 'in_stock').length },
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

  return (
    <div className="dashboard-products-section">
      <div className="dashboard-product-tabs">
        <div className="flex-1 min-w-0">
          <Tabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={(tabId) => setActiveTab(tabId as ProductFilter)} 
          />
        </div>
      </div>

      <div className="table-container overflow-x-auto table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th className="text-xs md:text-sm">{t('shop.references')}</th>
              <th className="hidden sm:table-cell text-xs md:text-sm">{t('shop.product')}</th>
              <th className="hidden md:table-cell text-xs md:text-sm">{t('shop.productCategories')}</th>
              <th className="text-xs md:text-sm">{t('shop.quantityShort')}</th>
              <th className="hidden lg:table-cell text-xs md:text-sm">{t('shop.stockStatus')}</th>
              <th className="text-xs md:text-sm">{t('shop.action')}</th>
            </tr>
          </thead>
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
                    <div className="relative inline-flex">
                    <button
                      className="icon-btn"
                      title={t('shop.moreOptions')}
                      aria-label={t('shop.moreOptions')}
                      aria-expanded={openMenuId === product.id}
                      onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                    >
                      <EllipsisVertical size={16} />
                    </button>
                    {openMenuId === product.id && (
                      <div className="product-action-menu" role="menu">
                        <button role="menuitem"><Eye size={15} />Voir</button>
                        <button role="menuitem"><Pencil size={15} />Modifier</button>
                      </div>
                    )}
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
    </div>
  );
};

export default ProductsTable;
