import { useState } from "react";
import { Button } from "../ui";
import { Save } from "lucide-react";

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
        <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full bg-dark-bg/50 border border-dark-border text-dark-muted rounded-xl p-2.5 text-sm cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">College / University</label>
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="e.g. IIT Delhi"
          className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="e.g. Computer Science"
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-dark-muted mb-1.5">Graduation Year</label>
          <input
            type="number"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            placeholder="e.g. 2027"
            className="w-full bg-dark-bg border border-dark-border text-dark-text rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        fullWidth
        size="md"
        icon={Save}
        className="mt-2"
      >
        Update Profile Metrics
      </Button>
    </form>
  );
}

export default ProfileForm;