import {
  ClipboardList,
  Settings,
  Lock,
  Mail,
  Zap,
  Shield,
  Key,
  BarChart,
  AlertTriangle,
  Scale,
  Phone,
} from "lucide-react";
import { fetchContactInfo } from "../services/api";
import { useState, useEffect } from "react";

function Privacy() {
  const collection = [
    { points: "Personal information (name, email, phone number)" },
    { points: "Account credentials and preferences" },
    { points: "Payment and billing information" },
    { points: "Communication history and feedback" },
  ];

  const infoData = [
    { label: "Security & Authentication", icon: <Lock className="w-10 h-10 mx-auto text-blue-600 mb-3" />, desc: "Verify your identity and secure your account"},
    { label: "Communication", icon: <Mail className="w-10 h-10 mx-auto text-green-600 mb-3" />, desc: "Send important updates and respond to inquiries" },
    { label: "Service Improvement", icon: <Zap className="w-10 h-10 mx-auto text-purple-600 mb-3" />, desc: "Analyze usage patterns to enhance user experience" },

  ];

  const dataProtection = [
    { label: "Encryption", icon: <Shield className="text-blue-600 w-6 h-6" />, desc: "All data is encrypted in transit and at rest"},
    { label: "Access Control", icon: <Key className="text-green-600 w-6 h-6" />, desc: "Strict access controls and authentication"},
    { label: "Audits", icon: <BarChart className="text-purple-600 w-6 h-6" />, desc: "Continuous monitoring and security assessments"},
    { label: "Incident Response", icon: <AlertTriangle className="text-red-600 w-6 h-6" />, desc: "Rapid response to security incidents"},
  ];

  const rightsData = [
    { label: "Access", color: "bg-blue-500", desc: "Request a copy of your personal data", bgcolor:"bg-gradient-to-r from-blue-50 to-blue-100" },
    { label: "Correction", color: "bg-green-500", desc: "Update or correct inaccurate information", bgcolor:"bg-gradient-to-r from-green-50 to-green-100" },
    { label: "Deletion", color: "bg-red-500", desc: "Request deletion of your personal data", bgcolor:"bg-gradient-to-r from-red-50 to-red-100" },
    { label: "Portability", color: "bg-purple-500", desc: "Export your data in a structured format", bgcolor:"bg-gradient-to-r from-purple-50 to-purple-100" },
  ];

  // const contactData = [
  //   { label: "Email", value: "financetracker@gmail.com" },
  //   { label: "Phone", value: "+923034594499" },
  //   { label: "Address", value: "123 Privacy Street, Data City, DC 12345" },
  // ];

  const [ contacts, setContacts ] = useState([]);
  const [ error, setError ] = useState(null);
  
  useEffect(() => {
      const loadContact = async () => {
          try {
              const response = await fetchContactInfo();
              setContacts(response.contacts);
          } catch (err) {
              setError(err.message);
          } 
      };
      loadContact();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 mb-4">
            Your privacy is important to us. Learn how we protect your data.
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
            Last updated: December 2024
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ClipboardList className="text-blue-600 w-5 h-5" />
            </span>
            Information We Collect
          </h2>
          <p className="text-gray-600 mb-6">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support.
          </p>
          <ul className="space-y-3">
            {collection.map((info, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {info.points}
                </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <Settings className="text-green-600 w-5 h-5" />
            </span>
            How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services:
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {infoData.map((data, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl ">
                  {data.icon}
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {data.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {data.desc}
                  </p>

                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Shield className="text-red-600 w-5 h-5" />
            </span>
            Data Protection
          </h2>
          <p className="text-gray-600 mb-6">
            We implement industry-standard security measures to protect your
            personal information:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {dataProtection.map((protect, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                {protect.icon}
                <div>
                  <h4 className="font-semibold text-gray-800">{protect.label}</h4>
                  <p className="text-sm text-gray-600">
                  {protect.desc}
                </p>
                </div>
              </div>
            ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <Scale className="text-yellow-600 w-5 h-5" />
            </span>
            Your Rights
          </h2>
          <p className="text-gray-600 mb-6">
            You have the following rights regarding your personal data:
          </p>
          <div className="space-y-4">
            {rightsData.map((rights, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg gap-3 ${rights.bgcolor}`}
              >
                <span
                  className={`text-white px-3 py-1 rounded-full text-sm font-medium ${rights.color}`}
                >
                  {rights.label}
                </span>
                <span className="text-gray-700">{rights.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
              <Phone className="w-5 h-5 text-white" />
            </span>
            Contact Us
          </h2>
          <p className="text-gray-300 mb-6">
            If you have any questions about this Privacy Policy, please contact us:
          </p>

          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-4">
                <span className="text-blue-400 font-medium">{contact.label}</span>
                <span className="text-white text-sm md:text-[0.9rem]">{contact.value}</span>
              </div>
            ))}

            {error && ( 
            <p className="text-red-500">Error Loading Contact Information: {error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
