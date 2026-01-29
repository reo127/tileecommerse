import { HiCog, HiExclamationCircle } from "react-icons/hi";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your store settings</p>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCog className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Settings Panel - Coming Soon
          </h2>
          <p className="text-slate-600 mb-6 leading-relaxed">
            The settings panel is under development. This feature will allow you to:
          </p>
          <div className="bg-slate-50 rounded-lg p-6 mb-6">
            <ul className="text-left space-y-3 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Update store information and branding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Configure payment gateway settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Manage shipping zones and rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Set tax rules and calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Configure email templates and notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-600 mt-1">✓</span>
                <span>Manage admin users and roles</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
            <HiExclamationCircle className="w-5 h-5" />
            <p>Current settings are managed via environment variables (.env.local)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
