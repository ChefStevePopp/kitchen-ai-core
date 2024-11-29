import React, { useState } from 'react';
import { X, Camera, Phone, Mail, MapPin, Building, Tag } from 'lucide-react';
import { useTeamStore } from '../../stores/teamStore';
import { AvatarCustomizer } from '@/features/shared/components';
import type { TeamMemberData } from '../../types';
import toast from 'react-hot-toast';

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMemberData;
}

export const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({ isOpen, onClose, member }) => {
  const { updateMember } = useTeamStore();
  const [formData, setFormData] = useState({
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    phone: member.phone,
    avatar: member.avatar,
    departments: member.departments,
    roles: member.roles,
    locations: member.locations
  });

  const [isAvatarCustomizerOpen, setIsAvatarCustomizerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMember(member.id, {
        ...formData,
        lastUpdated: new Date().toISOString()
      });
      toast.success('Profile updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    setIsAvatarCustomizerOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isAvatarCustomizerOpen ? (
          <div className="p-6">
            <AvatarCustomizer
              currentAvatar={formData.avatar}
              onSelect={handleAvatarSelect}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <img
                    src={formData.avatar}
                    alt={`${formData.firstName} ${formData.lastName}`}
                    className="w-24 h-24 rounded-full bg-gray-800 transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAvatarCustomizerOpen(true)}
                    className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full shadow-lg transition-transform group-hover:scale-110"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  Click the camera icon to customize your avatar with our fun avatar maker!
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Contact Information</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="input w-full pl-10"
                    placeholder="Email address"
                  />
                </div>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="input w-full pl-10"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Work Information</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Building className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={formData.departments.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      departments: e.target.value.split(',').map(d => d.trim()).filter(Boolean)
                    }))}
                    className="input w-full pl-10 min-h-[80px]"
                    placeholder="Departments (comma-separated)"
                  />
                </div>
                <div className="relative">
                  <Tag className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={formData.roles.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      roles: e.target.value.split(',').map(r => r.trim()).filter(Boolean)
                    }))}
                    className="input w-full pl-10 min-h-[80px]"
                    placeholder="Roles (comma-separated)"
                  />
                </div>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={formData.locations.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      locations: e.target.value.split(',').map(l => l.trim()).filter(Boolean)
                    }))}
                    className="input w-full pl-10 min-h-[80px]"
                    placeholder="Locations (comma-separated)"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTeamMemberModal;