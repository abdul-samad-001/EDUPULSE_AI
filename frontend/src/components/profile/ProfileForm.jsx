import { useState } from "react";

function ProfileForm({ initialData, onSave }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    college: initialData?.college || "",
    branch: initialData?.branch || "",
    graduationYear: initialData?.graduationYear || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">College / University</label>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="e.g. IIT Delhi"
          className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Graduation Year</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2027"
            className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-2 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
      >
        Update Profile Metrics
      </button>
    </form>
  );
}

export default ProfileForm;