import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import ImageUpload from '../components/common/ImageUpload';
import { ArrowRight } from 'lucide-react';

interface ProductForm {
  name: string;
  category: string;
  price: string;
  quantity: string;
  ageRange: string;
  gender: string;
  images: File[];
}

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    price: '',
    quantity: '',
    ageRange: '',
    gender: '',
    images: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  const categories = [
    'Vêtements',
    'Chaussures',
    'Accessoires',
    'Électronique',
    'Livres',
    'Jouets',
    'Autres'
  ];

  const ageRanges = [
    'Adulte',
    'Enfant'
  ];

  const getGenderOptions = () => {
    if (formData.ageRange === 'Adulte') {
      return ['Homme', 'Femme', 'Unisexe'];
    } else if (formData.ageRange === 'Enfant') {
      return ['Filles', 'Garçon', 'Unisexe'];
    }
    return [];
  };

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'ageRange') {
        newData.gender = '';
      }
      return newData;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'ageRange' && errors.gender) {
      setErrors(prev => ({ ...prev, gender: '' }));
    }
  };

  const handleImagesChange = (images: File[]) => {
    setFormData(prev => ({ ...prev, images }));
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductForm, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'article est requis';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Le prix est requis';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être un nombre valide';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'La quantité est requise';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'La quantité doit être un nombre valide';
    }

    if (!formData.ageRange) {
      newErrors.ageRange = 'La tranche d\'âge est requise';
    }

    if (!formData.gender) {
      newErrors.gender = 'La catégorie de genre est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      ageRange: '',
      gender: '',
      images: []
    });
    setErrors({});
  };

  const handleAddAnother = () => {
    if (validateForm()) {
      console.log('Produit ajouté:', formData);
      handleReset();
      alert('Produit ajouté avec succès! Vous pouvez en ajouter un autre.');
    }
  };

  const handlePublish = () => {
    if (validateForm()) {
      console.log('Publication des produits:', formData);
      alert('Produit(s) publié(s) avec succès!');
      handleReset();
    }
  };

  const [mainPreviewUrl, setMainPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (formData.images.length > 0) {
      const url = URL.createObjectURL(formData.images[0]);
      setMainPreviewUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setMainPreviewUrl(null);
      return undefined;
    }
  }, [formData.images]);

  return (
    <DashboardLayout activePath="/produits/ajouter">
      <div className="max-w-7xl mx-auto px-0">
        <h1 className="text-xl md:text-2xl font-bold text-(--color-text-primary) mb-6 md:mb-8">
          Ajouter vos produits
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {/* Nom de l'article */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Nom de l'article <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.name ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                    placeholder="Entrez le nom du produit"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Catégorie de l'article */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Catégorie de l'article <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.category ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1">{errors.category}</p>
                  )}
                </div>

                {/* Prix de l'article */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Prix de l'article <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.price ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>

                {/* Quantité d'article */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Quantité d'article <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.quantity ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                    placeholder="0"
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                  )}
                </div>

                {/* Tranche d'âge */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Tranche d'âge <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.ageRange}
                    onChange={(e) => handleInputChange('ageRange', e.target.value)}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.ageRange ? 'border-red-500' : 'border-(--color-border)'
                    }`}
                  >
                    <option value="">Sélectionnez une tranche d'âge</option>
                    {ageRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                  {errors.ageRange && (
                    <p className="text-xs text-red-500 mt-1">{errors.ageRange}</p>
                  )}
                </div>

                {/* Catégorie de genre */}
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-2">
                    Choisissez une catégorie de genre <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!formData.ageRange}
                    className={`w-full px-3 md:px-4 py-2 md:py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) transition-all ${
                      errors.gender ? 'border-red-500' : 'border-(--color-border)'
                    } ${!formData.ageRange ? 'opacity-50 cursor-not-allowed bg-(--color-secondary)' : ''}`}
                  >
                    <option value="">Sélectionnez un genre</option>
                    {getGenderOptions().map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                  {!formData.ageRange && (
                    <p className="text-xs text-(--color-text-secondary) mt-1">Veuillez d'abord sélectionner une tranche d'âge</p>
                  )}
                  {errors.gender && (
                    <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Section images */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-(--color-border)">
                <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-4">
                  Images du produits
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <p className="text-sm text-(--color-text-secondary)">
                    Importer les images du produits :
                  </p>
                  <button
                    type="button"
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                    className="btn-primary flex items-center justify-center gap-2 sm:flex-none"
                  >
                    + Ajouter une images
                  </button>
                </div>
                
                <ImageUpload
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                />
              </div>

              {/* Boutons d'action */}
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-secondary flex-1"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={handleAddAnother}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  Ajouter un autre produit
                  <ArrowRight size={18} />
                </button>
              </div>
            </Card>
          </div>

          {/* Preview de l'image principale */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-base md:text-lg font-semibold text-(--color-text-primary) mb-4">
                Importer une images
              </h3>
              <div className="aspect-square rounded-xl bg-(--color-secondary) flex items-center justify-center overflow-hidden">
                {mainPreviewUrl ? (
                  <img
                    src={mainPreviewUrl}
                    alt="Preview principale"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 md:p-8">
                    <svg 
                      className="w-16 md:w-24 h-16 md:h-24 mx-auto text-(--color-text-tertiary) mb-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <p className="text-xs md:text-sm text-(--color-text-tertiary)">
                      Aucune image sélectionnée
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handlePublish}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Publiez le(s) Produit(s)
                <ArrowRight size={18} />
              </button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProductPage;
