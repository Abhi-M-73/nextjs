// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
// import { HiOutlineUser, HiOutlineMail } from "react-icons/hi";
// import { RiLockPasswordLine, RiPhoneLine, RiGiftLine } from "react-icons/ri";
// import signupPageElement from "../../assets/SignupPageElement.png";
// import Flag from "react-world-flags";
// import toast from "react-hot-toast";
// import { Button, CircularProgress } from "@mui/material";
// import { userRegister } from "../../api/auth.api";
// import { useDispatch } from "react-redux";

// const options = [
//   { name: "Afghanistan", value: "+93", code: "AF" },
//   { name: "Albania", value: "+355", code: "AL" },
//   { name: "Algeria", value: "+213", code: "DZ" },
//   { name: "Andorra", value: "+376", code: "AD" },
//   { name: "Angola", value: "+244", code: "AO" },
//   { name: "Antigua and Barbuda", value: "+1-268", code: "AG" },
//   { name: "Argentina", value: "+54", code: "AR" },
//   { name: "Armenia", value: "+374", code: "AM" },
//   { name: "Australia", value: "+61", code: "AU" },
//   { name: "Austria", value: "+43", code: "AT" },
//   { name: "Azerbaijan", value: "+994", code: "AZ" },
//   { name: "Bahamas", value: "+1-242", code: "BS" },
//   { name: "Bahrain", value: "+973", code: "BH" },
//   { name: "Bangladesh", value: "+880", code: "BD" },
//   { name: "Barbados", value: "+1-246", code: "BB" },
//   { name: "Belarus", value: "+375", code: "BY" },
//   { name: "Belgium", value: "+32", code: "BE" },
//   { name: "Belize", value: "+501", code: "BZ" },
//   { name: "Benin", value: "+229", code: "BJ" },
//   { name: "Bhutan", value: "+975", code: "BT" },
//   { name: "Bolivia", value: "+591", code: "BO" },
//   { name: "Bosnia and Herzegovina", value: "+387", code: "BA" },
//   { name: "Botswana", value: "+267", code: "BW" },
//   { name: "Brazil", value: "+55", code: "BR" },
//   { name: "Brunei", value: "+673", code: "BN" },
//   { name: "Bulgaria", value: "+359", code: "BG" },
//   { name: "Burkina Faso", value: "+226", code: "BF" },
//   { name: "Burundi", value: "+257", code: "BI" },
//   { name: "Cambodia", value: "+855", code: "KH" },
//   { name: "Cameroon", value: "+237", code: "CM" },
//   { name: "Canada", value: "+1", code: "CA" },
//   { name: "Cape Verde", value: "+238", code: "CV" },
//   { name: "Central African Republic", value: "+236", code: "CF" },
//   { name: "Chad", value: "+235", code: "TD" },
//   { name: "Chile", value: "+56", code: "CL" },
//   { name: "China", value: "+86", code: "CN" },
//   { name: "Colombia", value: "+57", code: "CO" },
//   { name: "Comoros", value: "+269", code: "KM" },
//   { name: "Congo (Brazzaville)", value: "+242", code: "CG" },
//   { name: "Congo (Kinshasa)", value: "+243", code: "CD" },
//   { name: "Costa Rica", value: "+506", code: "CR" },
//   { name: "Croatia", value: "+385", code: "HR" },
//   { name: "Cuba", value: "+53", code: "CU" },
//   { name: "Cyprus", value: "+357", code: "CY" },
//   { name: "Czech Republic", value: "+420", code: "CZ" },
//   { name: "Denmark", value: "+45", code: "DK" },
//   { name: "Djibouti", value: "+253", code: "DJ" },
//   { name: "Dominica", value: "+1-767", code: "DM" },
//   { name: "Dominican Republic", value: "+1-809", code: "DO" },
//   { name: "Ecuador", value: "+593", code: "EC" },
//   { name: "Egypt", value: "+20", code: "EG" },
//   { name: "El Salvador", value: "+503", code: "SV" },
//   { name: "Equatorial Guinea", value: "+240", code: "GQ" },
//   { name: "Eritrea", value: "+291", code: "ER" },
//   { name: "Estonia", value: "+372", code: "EE" },
//   { name: "Eswatini", value: "+268", code: "SZ" },
//   { name: "Ethiopia", value: "+251", code: "ET" },
//   { name: "Fiji", value: "+679", code: "FJ" },
//   { name: "Finland", value: "+358", code: "FI" },
//   { name: "France", value: "+33", code: "FR" },
//   { name: "Gabon", value: "+241", code: "GA" },
//   { name: "Gambia", value: "+220", code: "GM" },
//   { name: "Georgia", value: "+995", code: "GE" },
//   { name: "Germany", value: "+49", code: "DE" },
//   { name: "Ghana", value: "+233", code: "GH" },
//   { name: "Greece", value: "+30", code: "GR" },
//   { name: "Grenada", value: "+1-473", code: "GD" },
//   { name: "Guatemala", value: "+502", code: "GT" },
//   { name: "Guinea", value: "+224", code: "GN" },
//   { name: "Guinea-Bissau", value: "+245", code: "GW" },
//   { name: "Guyana", value: "+592", code: "GY" },
//   { name: "Haiti", value: "+509", code: "HT" },
//   { name: "Honduras", value: "+504", code: "HN" },
//   { name: "Hungary", value: "+36", code: "HU" },
//   { name: "Iceland", value: "+354", code: "IS" },
//   { name: "India", value: "+91", code: "IN" },
//   { name: "Indonesia", value: "+62", code: "ID" },
//   { name: "Iran", value: "+98", code: "IR" },
//   { name: "Iraq", value: "+964", code: "IQ" },
//   { name: "Ireland", value: "+353", code: "IE" },
//   { name: "Israel", value: "+972", code: "IL" },
//   { name: "Italy", value: "+39", code: "IT" },
//   { name: "Jamaica", value: "+1-876", code: "JM" },
//   { name: "Japan", value: "+81", code: "JP" },
//   { name: "Jordan", value: "+962", code: "JO" },
//   { name: "Kazakhstan", value: "+7", code: "KZ" },
//   { name: "Kenya", value: "+254", code: "KE" },
//   { name: "Kiribati", value: "+686", code: "KI" },
//   { name: "Kuwait", value: "+965", code: "KW" },
//   { name: "Kyrgyzstan", value: "+996", code: "KG" },
//   { name: "Laos", value: "+856", code: "LA" },
//   { name: "Latvia", value: "+371", code: "LV" },
//   { name: "Lebanon", value: "+961", code: "LB" },
//   { name: "Lesotho", value: "+266", code: "LS" },
//   { name: "Liberia", value: "+231", code: "LR" },
//   { name: "Libya", value: "+218", code: "LY" },
//   { name: "Liechtenstein", value: "+423", code: "LI" },
//   { name: "Lithuania", value: "+370", code: "LT" },
//   { name: "Luxembourg", value: "+352", code: "LU" },
//   { name: "Madagascar", value: "+261", code: "MG" },
//   { name: "Malawi", value: "+265", code: "MW" },
//   { name: "Malaysia", value: "+60", code: "MY" },
//   { name: "Maldives", value: "+960", code: "MV" },
//   { name: "Mali", value: "+223", code: "ML" },
//   { name: "Malta", value: "+356", code: "MT" },
//   { name: "Marshall Islands", value: "+692", code: "MH" },
//   { name: "Mauritania", value: "+222", code: "MR" },
//   { name: "Mauritius", value: "+230", code: "MU" },
//   { name: "Mexico", value: "+52", code: "MX" },
//   { name: "Micronesia", value: "+691", code: "FM" },
//   { name: "Moldova", value: "+373", code: "MD" },
//   { name: "Monaco", value: "+377", code: "MC" },
//   { name: "Mongolia", value: "+976", code: "MN" },
//   { name: "Montenegro", value: "+382", code: "ME" },
//   { name: "Morocco", value: "+212", code: "MA" },
//   { name: "Mozambique", value: "+258", code: "MZ" },
//   { name: "Myanmar", value: "+95", code: "MM" },
//   { name: "Namibia", value: "+264", code: "NA" },
//   { name: "Nauru", value: "+674", code: "NR" },
//   { name: "Nepal", value: "+977", code: "NP" },
//   { name: "Netherlands", value: "+31", code: "NL" },
//   { name: "New Zealand", value: "+64", code: "NZ" },
//   { name: "Nicaragua", value: "+505", code: "NI" },
//   { name: "Niger", value: "+227", code: "NE" },
//   { name: "Nigeria", value: "+234", code: "NG" },
//   { name: "North Korea", value: "+850", code: "KP" },
//   { name: "North Macedonia", value: "+389", code: "MK" },
//   { name: "Norway", value: "+47", code: "NO" },
//   { name: "Oman", value: "+968", code: "OM" },
//   { name: "Pakistan", value: "+92", code: "PK" },
//   { name: "Palau", value: "+680", code: "PW" },
//   { name: "Palestine", value: "+970", code: "PS" },
//   { name: "Panama", value: "+507", code: "PA" },
//   { name: "Papua New Guinea", value: "+675", code: "PG" },
//   { name: "Paraguay", value: "+595", code: "PY" },
//   { name: "Peru", value: "+51", code: "PE" },
//   { name: "Philippines", value: "+63", code: "PH" },
//   { name: "Poland", value: "+48", code: "PL" },
//   { name: "Portugal", value: "+351", code: "PT" },
//   { name: "Qatar", value: "+974", code: "QA" },
//   { name: "Romania", value: "+40", code: "RO" },
//   { name: "Russia", value: "+7", code: "RU" },
//   { name: "Rwanda", value: "+250", code: "RW" },
//   { name: "Saint Kitts and Nevis", value: "+1-869", code: "KN" },
//   { name: "Saint Lucia", value: "+1-758", code: "LC" },
//   { name: "Saint Vincent and the Grenadines", value: "+1-784", code: "VC" },
//   { name: "Samoa", value: "+685", code: "WS" },
//   { name: "San Marino", value: "+378", code: "SM" },
//   { name: "Sao Tome and Principe", value: "+239", code: "ST" },
//   { name: "Saudi Arabia", value: "+966", code: "SA" },
//   { name: "Senegal", value: "+221", code: "SN" },
//   { name: "Serbia", value: "+381", code: "RS" },
//   { name: "Seychelles", value: "+248", code: "SC" },
//   { name: "Sierra Leone", value: "+232", code: "SL" },
//   { name: "Singapore", value: "+65", code: "SG" },
//   { name: "Slovakia", value: "+421", code: "SK" },
//   { name: "Slovenia", value: "+386", code: "SI" },
//   { name: "Solomon Islands", value: "+677", code: "SB" },
//   { name: "Somalia", value: "+252", code: "SO" },
//   { name: "South Africa", value: "+27", code: "ZA" },
//   { name: "South Korea", value: "+82", code: "KR" },
//   { name: "South Sudan", value: "+211", code: "SS" },
//   { name: "Spain", value: "+34", code: "ES" },
//   { name: "Sri Lanka", value: "+94", code: "LK" },
//   { name: "Sudan", value: "+249", code: "SD" },
//   { name: "Suriname", value: "+597", code: "SR" },
//   { name: "Sweden", value: "+46", code: "SE" },
//   { name: "Switzerland", value: "+41", code: "CH" },
//   { name: "Syria", value: "+963", code: "SY" },
//   { name: "Taiwan", value: "+886", code: "TW" },
//   { name: "Tajikistan", value: "+992", code: "TJ" },
//   { name: "Tanzania", value: "+255", code: "TZ" },
//   { name: "Thailand", value: "+66", code: "TH" },
//   { name: "Timor-Leste", value: "+670", code: "TL" },
//   { name: "Togo", value: "+228", code: "TG" },
//   { name: "Tonga", value: "+676", code: "TO" },
//   { name: "Trinidad and Tobago", value: "+1-868", code: "TT" },
//   { name: "Tunisia", value: "+216", code: "TN" },
//   { name: "Turkey", value: "+90", code: "TR" },
//   { name: "Turkmenistan", value: "+993", code: "TM" },
//   { name: "Tuvalu", value: "+688", code: "TV" },
//   { name: "Uganda", value: "+256", code: "UG" },
//   { name: "Ukraine", value: "+380", code: "UA" },
//   { name: "United Arab Emirates", value: "+971", code: "AE" },
//   { name: "United Kingdom", value: "+44", code: "GB" },
//   { name: "United States", value: "+1", code: "US" },
//   { name: "Uruguay", value: "+598", code: "UY" },
//   { name: "Uzbekistan", value: "+998", code: "UZ" },
//   { name: "Vanuatu", value: "+678", code: "VU" },
//   { name: "Vatican City", value: "+379", code: "VA" },
//   { name: "Venezuela", value: "+58", code: "VE" },
//   { name: "Vietnam", value: "+84", code: "VN" },
//   { name: "Yemen", value: "+967", code: "YE" },
//   { name: "Zambia", value: "+260", code: "ZM" },
//   { name: "Zimbabwe", value: "+263", code: "ZW" },
// ];

// const Register = () => {
//   const { search } = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [focusedField, setFocusedField] = useState(null);

//   const [payload, setPayload] = useState({
//     name: "",
//     password: "",
//     confirmPassword: "",
//     mobile: "",
//     countryCode: "+91",
//     email: "",
//     referredBy: "",
//     referredByFromParam: false,
//   });

//   useEffect(() => {
//     const params = new URLSearchParams(search);
//     const inviteCode = params.get("referredBy") || ""; // 👈 fix: invite_code → referredBy
//     setPayload((prev) => ({
//       ...prev,
//       referredBy: inviteCode,
//       referredByFromParam: !!inviteCode,
//     }));
//   }, [search]);

//   const handleSubmit = async () => {
//     if (loading) return;
//     const {
//       name,
//       password,
//       confirmPassword,
//       mobile,
//       email,
//       countryCode,
//       referredBy,
//     } = payload;

//     if (!name || !password || !confirmPassword || !mobile || !email) {
//       toast.error("Please fill in all the required fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }

//     const selectedCountry = options.find((opt) => opt.value === countryCode);

//     const fullPayload = {
//       name: name.trim(),
//       countryCode: {
//         name: selectedCountry?.name || "",
//         value: selectedCountry?.value || "",
//       },
//       phone: `${countryCode}${mobile}`.trim(),
//       email: email.trim().toLowerCase(),
//       password: password.trim(),
//       referredBy: referredBy.trim(),
//     };

//     try {
//       setLoading(true);
//       const response = await userRegister(fullPayload);
//       if (response?.success) {
//         toast.success(response?.message || "Registration Successful.");
//         navigate("/auth/login");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || error.message || "error in register",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fieldClass = (field, hasError) =>
//     `flex items-center gap-2.5 rounded-xl border transition-all duration-300 bg-gray-50 px-3.5 ${
//       hasError
//         ? "border-red-400"
//         : focusedField === field
//           ? "border-blue-500 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
//           : "border-gray-200"
//     }`;

//   return (
//     <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-blue-50/40 w-full px-4 py-10 overflow-hidden">
//       {/* Ambient glow background */}
//       <div className="pointer-events-none absolute -top-40 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-[120px]" />
//       <div className="pointer-events-none absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
//       <div
//         className="pointer-events-none absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
//           backgroundSize: "40px 40px",
//         }}
//       />

//       <div className="relative mx-auto rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-blue-100 text-gray-900 max-w-[440px] w-full py-8">
//         <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

//         <div className="w-full flex justify-between items-center mb-6 px-6">
//           <div>
//             <p className="text-[11px] font-semibold text-blue-600 tracking-[0.2em] mb-1">
//               CREATE ACCOUNT
//             </p>
//             <Link
//               to="/"
//               className="text-3xl font-extrabold text-gray-900 tracking-tight"
//             >
//               Registration
//             </Link>
//           </div>
//           <div className="relative">
//             <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg" />
//             <img
//               src={signupPageElement}
//               className="relative h-16 w-16 object-cover rounded-full ring-2 ring-blue-100"
//               alt="img"
//             />
//           </div>
//         </div>

//         <div className="space-y-5 px-6">
//           {/* NAME */}
//           <div>
//             <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
//               NAME <span className="text-red-500">*</span>
//             </label>
//             <div className={fieldClass("name", false)}>
//               <HiOutlineUser
//                 size={18}
//                 className={
//                   focusedField === "name" ? "text-blue-600" : "text-gray-400"
//                 }
//               />
//               <input
//                 type="text"
//                 className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
//                 placeholder="Enter user name"
//                 value={payload.name}
//                 required
//                 onFocus={() => setFocusedField("name")}
//                 onBlur={() => setFocusedField(null)}
//                 onChange={(e) =>
//                   setPayload({ ...payload, name: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
//               PASSWORD <span className="text-red-500">*</span>
//             </label>
//             <div className={`${fieldClass("password", false)} mb-3`}>
//               <RiLockPasswordLine
//                 size={18}
//                 className={
//                   focusedField === "password"
//                     ? "text-blue-600"
//                     : "text-gray-400"
//                 }
//               />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
//                 placeholder="Enter your password"
//                 value={payload.password}
//                 required
//                 onFocus={() => setFocusedField("password")}
//                 onBlur={() => setFocusedField(null)}
//                 onChange={(e) =>
//                   setPayload({ ...payload, password: e.target.value })
//                 }
//               />
//               {showPassword ? (
//                 <FaRegEyeSlash
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
//                 />
//               ) : (
//                 <FaRegEye
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
//                 />
//               )}
//             </div>

//             {/* CONFIRM PASSWORD */}
//             <div className={fieldClass("confirmPassword", false)}>
//               <RiLockPasswordLine
//                 size={18}
//                 className={
//                   focusedField === "confirmPassword"
//                     ? "text-blue-600"
//                     : "text-gray-400"
//                 }
//               />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
//                 placeholder="Re-enter password"
//                 value={payload.confirmPassword}
//                 required
//                 onFocus={() => setFocusedField("confirmPassword")}
//                 onBlur={() => setFocusedField(null)}
//                 onChange={(e) =>
//                   setPayload({ ...payload, confirmPassword: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* MOBILE */}
//           <div className="relative">
//             <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
//               MOBILE NO. <span className="text-red-500">*</span>
//             </label>
//             <div className="w-full flex gap-2 items-start">
//               <div className="w-[120px] shrink-0 relative">
//                 <div
//                   onClick={() => {
//                     setOpen(!open);
//                     if (!open) setSearchQuery("");
//                   }}
//                   className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 cursor-pointer flex items-center gap-2 hover:border-gray-300 transition-colors"
//                 >
//                   <Flag
//                     code={
//                       options.find((opt) => opt.value === payload.countryCode)
//                         ?.code || "IN"
//                     }
//                     style={{ width: 22, height: 14 }}
//                   />
//                   <span className="truncate text-sm">
//                     {
//                       options.find((opt) => opt.value === payload.countryCode)
//                         ?.value
//                     }
//                   </span>
//                   <span className="ml-auto text-xs text-gray-400">▼</span>
//                 </div>

//                 {open && (
//                   <div className="absolute z-10 w-[280px] max-h-80 overflow-auto mt-2 rounded-xl border border-gray-200 bg-white text-gray-900 text-base shadow-2xl shadow-gray-300/50">
//                     <div className="sticky top-0 bg-white border-b border-gray-100">
//                       <input
//                         type="text"
//                         className="w-full p-3 outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm"
//                         placeholder="Search country or code..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                       />
//                     </div>
//                     {options
//                       .filter(
//                         (option) =>
//                           option.name
//                             .toLowerCase()
//                             .includes(searchQuery.toLowerCase()) ||
//                           option.value.includes(searchQuery),
//                       )
//                       .map((option) => (
//                         <div
//                           key={`${option.name}-${option.value}`}
//                           onClick={() => {
//                             setPayload({
//                               ...payload,
//                               countryCode: option.value,
//                             });
//                             setOpen(false);
//                             setSearchQuery("");
//                           }}
//                           className={`flex items-center justify-between p-3 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-blue-50 transition-colors ${
//                             payload.countryCode === option.value
//                               ? "text-blue-600 bg-blue-50/60"
//                               : ""
//                           }`}
//                         >
//                           <div className="flex items-center gap-2">
//                             <Flag
//                               code={option.code}
//                               style={{ width: 22, height: 14 }}
//                             />
//                             <span className="text-sm">
//                               {option.value} ({option.name})
//                             </span>
//                           </div>
//                           <span
//                             className={`w-4 h-4 rounded-full border-2 shrink-0 ${
//                               payload.countryCode === option.value
//                                 ? "border-blue-600 bg-blue-600"
//                                 : "border-gray-300"
//                             }`}
//                           />
//                         </div>
//                       ))}
//                   </div>
//                 )}
//               </div>

//               <div className={`${fieldClass("mobile", false)} flex-1`}>
//                 <RiPhoneLine
//                   size={18}
//                   className={
//                     focusedField === "mobile"
//                       ? "text-blue-600"
//                       : "text-gray-400"
//                   }
//                 />
//                 <input
//                   type="number"
//                   className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
//                   placeholder="Enter mobile number"
//                   value={payload.mobile}
//                   onFocus={() => setFocusedField("mobile")}
//                   onBlur={() => setFocusedField(null)}
//                   onChange={(e) =>
//                     setPayload({ ...payload, mobile: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
//               EMAIL <span className="text-red-500">*</span>
//             </label>
//             <div className={fieldClass("email", false)}>
//               <HiOutlineMail
//                 size={18}
//                 className={
//                   focusedField === "email" ? "text-blue-600" : "text-gray-400"
//                 }
//               />
//               <input
//                 type="email"
//                 className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
//                 placeholder="Enter your email id"
//                 value={payload.email}
//                 onFocus={() => setFocusedField("email")}
//                 onBlur={() => setFocusedField(null)}
//                 onChange={(e) =>
//                   setPayload({ ...payload, email: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           {/* REFERRAL */}
//           <div>
//             <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
//               REFERRAL CODE
//             </label>
//             <div
//               className={`${fieldClass("referredBy", false)} ${
//                 payload.referredByFromParam ? "opacity-60" : ""
//               }`}
//             >
//               <RiGiftLine
//                 size={18}
//                 className={
//                   focusedField === "referredBy"
//                     ? "text-blue-600"
//                     : "text-gray-400"
//                 }
//               />
//               <input
//                 type="text"
//                 className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed"
//                 placeholder="Referral code"
//                 value={payload.referredBy}
//                 onFocus={() => setFocusedField("referredBy")}
//                 onBlur={() => setFocusedField(null)}
//                 onChange={(e) => {
//                   if (!payload.referredByFromParam) {
//                     setPayload({
//                       ...payload,
//                       referredBy: e.target.value?.toUpperCase(),
//                     });
//                   }
//                 }}
//                 disabled={payload.referredByFromParam}
//               />
//             </div>
//           </div>

//           {/* SUBMIT */}
//           <Button
//             fullWidth
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//             sx={{
//               background: "linear-gradient(135deg, #2563eb, #4338ca)",
//               color: "#fff",
//               fontWeight: 800,
//               textTransform: "none",
//               borderRadius: "12px",
//               py: 1.3,
//               fontSize: "15px",
//               boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
//               "&:hover": {
//                 background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
//                 boxShadow: "0 10px 28px rgba(37,99,235,0.4)",
//               },
//               "&.Mui-disabled": {
//                 background: "rgba(37,99,235,0.2)",
//                 color: "#fff",
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={22} sx={{ color: "#fff" }} />
//             ) : (
//               "Sign Up"
//             )}
//           </Button>

//           <p className="text-center text-gray-500 text-sm py-2">
//             HAVE AN ACCOUNT?{" "}
//             <Link
//               className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
//               to={"/auth/login"}
//             >
//               LOG IN
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { HiOutlineUser, HiOutlineMail } from "react-icons/hi";
import {
  RiLockPasswordLine,
  RiPhoneLine,
  RiGiftLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import signupPageElement from "../../assets/SignupPageElement.png";
import Flag from "react-world-flags";
import toast from "react-hot-toast";
import { Button, CircularProgress, Dialog, DialogContent } from "@mui/material";
import { userRegister } from "../../api/auth.api";
import { useDispatch } from "react-redux";

const options = [
  { name: "Afghanistan", value: "+93", code: "AF" },
  { name: "Albania", value: "+355", code: "AL" },
  { name: "Algeria", value: "+213", code: "DZ" },
  { name: "Andorra", value: "+376", code: "AD" },
  { name: "Angola", value: "+244", code: "AO" },
  { name: "Antigua and Barbuda", value: "+1-268", code: "AG" },
  { name: "Argentina", value: "+54", code: "AR" },
  { name: "Armenia", value: "+374", code: "AM" },
  { name: "Australia", value: "+61", code: "AU" },
  { name: "Austria", value: "+43", code: "AT" },
  { name: "Azerbaijan", value: "+994", code: "AZ" },
  { name: "Bahamas", value: "+1-242", code: "BS" },
  { name: "Bahrain", value: "+973", code: "BH" },
  { name: "Bangladesh", value: "+880", code: "BD" },
  { name: "Barbados", value: "+1-246", code: "BB" },
  { name: "Belarus", value: "+375", code: "BY" },
  { name: "Belgium", value: "+32", code: "BE" },
  { name: "Belize", value: "+501", code: "BZ" },
  { name: "Benin", value: "+229", code: "BJ" },
  { name: "Bhutan", value: "+975", code: "BT" },
  { name: "Bolivia", value: "+591", code: "BO" },
  { name: "Bosnia and Herzegovina", value: "+387", code: "BA" },
  { name: "Botswana", value: "+267", code: "BW" },
  { name: "Brazil", value: "+55", code: "BR" },
  { name: "Brunei", value: "+673", code: "BN" },
  { name: "Bulgaria", value: "+359", code: "BG" },
  { name: "Burkina Faso", value: "+226", code: "BF" },
  { name: "Burundi", value: "+257", code: "BI" },
  { name: "Cambodia", value: "+855", code: "KH" },
  { name: "Cameroon", value: "+237", code: "CM" },
  { name: "Canada", value: "+1", code: "CA" },
  { name: "Cape Verde", value: "+238", code: "CV" },
  { name: "Central African Republic", value: "+236", code: "CF" },
  { name: "Chad", value: "+235", code: "TD" },
  { name: "Chile", value: "+56", code: "CL" },
  { name: "China", value: "+86", code: "CN" },
  { name: "Colombia", value: "+57", code: "CO" },
  { name: "Comoros", value: "+269", code: "KM" },
  { name: "Congo (Brazzaville)", value: "+242", code: "CG" },
  { name: "Congo (Kinshasa)", value: "+243", code: "CD" },
  { name: "Costa Rica", value: "+506", code: "CR" },
  { name: "Croatia", value: "+385", code: "HR" },
  { name: "Cuba", value: "+53", code: "CU" },
  { name: "Cyprus", value: "+357", code: "CY" },
  { name: "Czech Republic", value: "+420", code: "CZ" },
  { name: "Denmark", value: "+45", code: "DK" },
  { name: "Djibouti", value: "+253", code: "DJ" },
  { name: "Dominica", value: "+1-767", code: "DM" },
  { name: "Dominican Republic", value: "+1-809", code: "DO" },
  { name: "Ecuador", value: "+593", code: "EC" },
  { name: "Egypt", value: "+20", code: "EG" },
  { name: "El Salvador", value: "+503", code: "SV" },
  { name: "Equatorial Guinea", value: "+240", code: "GQ" },
  { name: "Eritrea", value: "+291", code: "ER" },
  { name: "Estonia", value: "+372", code: "EE" },
  { name: "Eswatini", value: "+268", code: "SZ" },
  { name: "Ethiopia", value: "+251", code: "ET" },
  { name: "Fiji", value: "+679", code: "FJ" },
  { name: "Finland", value: "+358", code: "FI" },
  { name: "France", value: "+33", code: "FR" },
  { name: "Gabon", value: "+241", code: "GA" },
  { name: "Gambia", value: "+220", code: "GM" },
  { name: "Georgia", value: "+995", code: "GE" },
  { name: "Germany", value: "+49", code: "DE" },
  { name: "Ghana", value: "+233", code: "GH" },
  { name: "Greece", value: "+30", code: "GR" },
  { name: "Grenada", value: "+1-473", code: "GD" },
  { name: "Guatemala", value: "+502", code: "GT" },
  { name: "Guinea", value: "+224", code: "GN" },
  { name: "Guinea-Bissau", value: "+245", code: "GW" },
  { name: "Guyana", value: "+592", code: "GY" },
  { name: "Haiti", value: "+509", code: "HT" },
  { name: "Honduras", value: "+504", code: "HN" },
  { name: "Hungary", value: "+36", code: "HU" },
  { name: "Iceland", value: "+354", code: "IS" },
  { name: "India", value: "+91", code: "IN" },
  { name: "Indonesia", value: "+62", code: "ID" },
  { name: "Iran", value: "+98", code: "IR" },
  { name: "Iraq", value: "+964", code: "IQ" },
  { name: "Ireland", value: "+353", code: "IE" },
  { name: "Israel", value: "+972", code: "IL" },
  { name: "Italy", value: "+39", code: "IT" },
  { name: "Jamaica", value: "+1-876", code: "JM" },
  { name: "Japan", value: "+81", code: "JP" },
  { name: "Jordan", value: "+962", code: "JO" },
  { name: "Kazakhstan", value: "+7", code: "KZ" },
  { name: "Kenya", value: "+254", code: "KE" },
  { name: "Kiribati", value: "+686", code: "KI" },
  { name: "Kuwait", value: "+965", code: "KW" },
  { name: "Kyrgyzstan", value: "+996", code: "KG" },
  { name: "Laos", value: "+856", code: "LA" },
  { name: "Latvia", value: "+371", code: "LV" },
  { name: "Lebanon", value: "+961", code: "LB" },
  { name: "Lesotho", value: "+266", code: "LS" },
  { name: "Liberia", value: "+231", code: "LR" },
  { name: "Libya", value: "+218", code: "LY" },
  { name: "Liechtenstein", value: "+423", code: "LI" },
  { name: "Lithuania", value: "+370", code: "LT" },
  { name: "Luxembourg", value: "+352", code: "LU" },
  { name: "Madagascar", value: "+261", code: "MG" },
  { name: "Malawi", value: "+265", code: "MW" },
  { name: "Malaysia", value: "+60", code: "MY" },
  { name: "Maldives", value: "+960", code: "MV" },
  { name: "Mali", value: "+223", code: "ML" },
  { name: "Malta", value: "+356", code: "MT" },
  { name: "Marshall Islands", value: "+692", code: "MH" },
  { name: "Mauritania", value: "+222", code: "MR" },
  { name: "Mauritius", value: "+230", code: "MU" },
  { name: "Mexico", value: "+52", code: "MX" },
  { name: "Micronesia", value: "+691", code: "FM" },
  { name: "Moldova", value: "+373", code: "MD" },
  { name: "Monaco", value: "+377", code: "MC" },
  { name: "Mongolia", value: "+976", code: "MN" },
  { name: "Montenegro", value: "+382", code: "ME" },
  { name: "Morocco", value: "+212", code: "MA" },
  { name: "Mozambique", value: "+258", code: "MZ" },
  { name: "Myanmar", value: "+95", code: "MM" },
  { name: "Namibia", value: "+264", code: "NA" },
  { name: "Nauru", value: "+674", code: "NR" },
  { name: "Nepal", value: "+977", code: "NP" },
  { name: "Netherlands", value: "+31", code: "NL" },
  { name: "New Zealand", value: "+64", code: "NZ" },
  { name: "Nicaragua", value: "+505", code: "NI" },
  { name: "Niger", value: "+227", code: "NE" },
  { name: "Nigeria", value: "+234", code: "NG" },
  { name: "North Korea", value: "+850", code: "KP" },
  { name: "North Macedonia", value: "+389", code: "MK" },
  { name: "Norway", value: "+47", code: "NO" },
  { name: "Oman", value: "+968", code: "OM" },
  { name: "Pakistan", value: "+92", code: "PK" },
  { name: "Palau", value: "+680", code: "PW" },
  { name: "Palestine", value: "+970", code: "PS" },
  { name: "Panama", value: "+507", code: "PA" },
  { name: "Papua New Guinea", value: "+675", code: "PG" },
  { name: "Paraguay", value: "+595", code: "PY" },
  { name: "Peru", value: "+51", code: "PE" },
  { name: "Philippines", value: "+63", code: "PH" },
  { name: "Poland", value: "+48", code: "PL" },
  { name: "Portugal", value: "+351", code: "PT" },
  { name: "Qatar", value: "+974", code: "QA" },
  { name: "Romania", value: "+40", code: "RO" },
  { name: "Russia", value: "+7", code: "RU" },
  { name: "Rwanda", value: "+250", code: "RW" },
  { name: "Saint Kitts and Nevis", value: "+1-869", code: "KN" },
  { name: "Saint Lucia", value: "+1-758", code: "LC" },
  { name: "Saint Vincent and the Grenadines", value: "+1-784", code: "VC" },
  { name: "Samoa", value: "+685", code: "WS" },
  { name: "San Marino", value: "+378", code: "SM" },
  { name: "Sao Tome and Principe", value: "+239", code: "ST" },
  { name: "Saudi Arabia", value: "+966", code: "SA" },
  { name: "Senegal", value: "+221", code: "SN" },
  { name: "Serbia", value: "+381", code: "RS" },
  { name: "Seychelles", value: "+248", code: "SC" },
  { name: "Sierra Leone", value: "+232", code: "SL" },
  { name: "Singapore", value: "+65", code: "SG" },
  { name: "Slovakia", value: "+421", code: "SK" },
  { name: "Slovenia", value: "+386", code: "SI" },
  { name: "Solomon Islands", value: "+677", code: "SB" },
  { name: "Somalia", value: "+252", code: "SO" },
  { name: "South Africa", value: "+27", code: "ZA" },
  { name: "South Korea", value: "+82", code: "KR" },
  { name: "South Sudan", value: "+211", code: "SS" },
  { name: "Spain", value: "+34", code: "ES" },
  { name: "Sri Lanka", value: "+94", code: "LK" },
  { name: "Sudan", value: "+249", code: "SD" },
  { name: "Suriname", value: "+597", code: "SR" },
  { name: "Sweden", value: "+46", code: "SE" },
  { name: "Switzerland", value: "+41", code: "CH" },
  { name: "Syria", value: "+963", code: "SY" },
  { name: "Taiwan", value: "+886", code: "TW" },
  { name: "Tajikistan", value: "+992", code: "TJ" },
  { name: "Tanzania", value: "+255", code: "TZ" },
  { name: "Thailand", value: "+66", code: "TH" },
  { name: "Timor-Leste", value: "+670", code: "TL" },
  { name: "Togo", value: "+228", code: "TG" },
  { name: "Tonga", value: "+676", code: "TO" },
  { name: "Trinidad and Tobago", value: "+1-868", code: "TT" },
  { name: "Tunisia", value: "+216", code: "TN" },
  { name: "Turkey", value: "+90", code: "TR" },
  { name: "Turkmenistan", value: "+993", code: "TM" },
  { name: "Tuvalu", value: "+688", code: "TV" },
  { name: "Uganda", value: "+256", code: "UG" },
  { name: "Ukraine", value: "+380", code: "UA" },
  { name: "United Arab Emirates", value: "+971", code: "AE" },
  { name: "United Kingdom", value: "+44", code: "GB" },
  { name: "United States", value: "+1", code: "US" },
  { name: "Uruguay", value: "+598", code: "UY" },
  { name: "Uzbekistan", value: "+998", code: "UZ" },
  { name: "Vanuatu", value: "+678", code: "VU" },
  { name: "Vatican City", value: "+379", code: "VA" },
  { name: "Venezuela", value: "+58", code: "VE" },
  { name: "Vietnam", value: "+84", code: "VN" },
  { name: "Yemen", value: "+967", code: "YE" },
  { name: "Zambia", value: "+260", code: "ZM" },
  { name: "Zimbabwe", value: "+263", code: "ZW" },
];

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-semibold text-gray-500 tracking-wide">
      {label}
    </span>
    <span className="text-sm font-bold text-gray-900">{value ?? "-"}</span>
  </div>
);

const Register = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // success popup ke liye naya state
  const [successOpen, setSuccessOpen] = useState(false);
  const [regSummary, setRegSummary] = useState(null);

  const [payload, setPayload] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    countryCode: "+91",
    email: "",
    referredBy: "",
    referredByFromParam: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const inviteCode = params.get("referredBy") || "";
    setPayload((prev) => ({
      ...prev,
      referredBy: inviteCode,
      referredByFromParam: !!inviteCode,
    }));
  }, [search]);

  const handleSubmit = async () => {
    if (loading) return;
    const {
      name,
      password,
      confirmPassword,
      mobile,
      email,
      countryCode,
      referredBy,
    } = payload;

    // email hata diya required validation se, ab optional hai
    if (!name || !password || !confirmPassword || !mobile) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const selectedCountry = options.find((opt) => opt.value === countryCode);

    const fullPayload = {
      name: name.trim(),
      countryCode: {
        name: selectedCountry?.name || "",
        value: selectedCountry?.value || "",
      },
      phone: `${countryCode}${mobile}`.trim(),
      ...(email.trim() && { email: email.trim().toLowerCase() }),
      password: password.trim(),
      referredBy: referredBy.trim(),
    };

    try {
      setLoading(true);
      const response = await userRegister(fullPayload);
      if (response?.success) {
        setRegSummary(response?.registrationSummary || null);
        setSuccessOpen(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "error in register",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate("/auth/login");
  };

  const fieldClass = (field, hasError) =>
    `flex items-center gap-2.5 rounded-xl border transition-all duration-300 bg-gray-50 px-3.5 ${
      hasError
        ? "border-red-400"
        : focusedField === field
          ? "border-blue-500 bg-white shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
          : "border-gray-200"
    }`;

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-blue-50/40 w-full px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#1d4ed8 1px, transparent 1px), linear-gradient(90deg, #1d4ed8 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-blue-100 text-gray-900 max-w-[440px] w-full py-8">
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        <div className="w-full flex justify-between items-center mb-6 px-6">
          <div>
            <p className="text-[11px] font-semibold text-blue-600 tracking-[0.2em] mb-1">
              CREATE ACCOUNT
            </p>
            <Link
              to="/"
              className="text-3xl font-extrabold text-gray-900 tracking-tight"
            >
              Registration
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg" />
            <img
              src={signupPageElement}
              className="relative h-16 w-16 object-cover rounded-full ring-2 ring-blue-100"
              alt="img"
            />
          </div>
        </div>

        <div className="space-y-5 px-6">
          {/* NAME */}
          <div>
            <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
              NAME <span className="text-red-500">*</span>
            </label>
            <div className={fieldClass("name", false)}>
              <HiOutlineUser
                size={18}
                className={
                  focusedField === "name" ? "text-blue-600" : "text-gray-400"
                }
              />
              <input
                type="text"
                className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                placeholder="Enter user name"
                value={payload.name}
                required
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
              PASSWORD <span className="text-red-500">*</span>
            </label>
            <div className={`${fieldClass("password", false)} mb-3`}>
              <RiLockPasswordLine
                size={18}
                className={
                  focusedField === "password"
                    ? "text-blue-600"
                    : "text-gray-400"
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                placeholder="Enter your password"
                value={payload.password}
                required
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setPayload({ ...payload, password: e.target.value })
                }
              />
              {showPassword ? (
                <FaRegEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
                />
              ) : (
                <FaRegEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-lg text-gray-400 hover:text-blue-600 cursor-pointer transition-colors flex-shrink-0"
                />
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className={fieldClass("confirmPassword", false)}>
              <RiLockPasswordLine
                size={18}
                className={
                  focusedField === "confirmPassword"
                    ? "text-blue-600"
                    : "text-gray-400"
                }
              />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                placeholder="Re-enter password"
                value={payload.confirmPassword}
                required
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setPayload({ ...payload, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          {/* MOBILE */}
          <div className="relative">
            <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
              MOBILE NO. <span className="text-red-500">*</span>
            </label>
            <div className="w-full flex gap-2 items-start">
              <div className="w-[120px] shrink-0 relative">
                <div
                  onClick={() => {
                    setOpen(!open);
                    if (!open) setSearchQuery("");
                  }}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 cursor-pointer flex items-center gap-2 hover:border-gray-300 transition-colors"
                >
                  <Flag
                    code={
                      options.find((opt) => opt.value === payload.countryCode)
                        ?.code || "IN"
                    }
                    style={{ width: 22, height: 14 }}
                  />
                  <span className="truncate text-sm">
                    {
                      options.find((opt) => opt.value === payload.countryCode)
                        ?.value
                    }
                  </span>
                  <span className="ml-auto text-xs text-gray-400">▼</span>
                </div>

                {open && (
                  <div className="absolute z-10 w-[280px] max-h-80 overflow-auto mt-2 rounded-xl border border-gray-200 bg-white text-gray-900 text-base shadow-2xl shadow-gray-300/50">
                    <div className="sticky top-0 bg-white border-b border-gray-100">
                      <input
                        type="text"
                        className="w-full p-3 outline-none bg-transparent text-gray-900 placeholder-gray-400 text-sm"
                        placeholder="Search country or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {options
                      .filter(
                        (option) =>
                          option.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          option.value.includes(searchQuery),
                      )
                      .map((option) => (
                        <div
                          key={`${option.name}-${option.value}`}
                          onClick={() => {
                            setPayload({
                              ...payload,
                              countryCode: option.value,
                            });
                            setOpen(false);
                            setSearchQuery("");
                          }}
                          className={`flex items-center justify-between p-3 border-b border-gray-50 last:border-b-0 cursor-pointer hover:bg-blue-50 transition-colors ${
                            payload.countryCode === option.value
                              ? "text-blue-600 bg-blue-50/60"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Flag
                              code={option.code}
                              style={{ width: 22, height: 14 }}
                            />
                            <span className="text-sm">
                              {option.value} ({option.name})
                            </span>
                          </div>
                          <span
                            className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                              payload.countryCode === option.value
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className={`${fieldClass("mobile", false)} flex-1`}>
                <RiPhoneLine
                  size={18}
                  className={
                    focusedField === "mobile"
                      ? "text-blue-600"
                      : "text-gray-400"
                  }
                />
                <input
                  type="number"
                  className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                  placeholder="Enter mobile number"
                  value={payload.mobile}
                  onFocus={() => setFocusedField("mobile")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) =>
                    setPayload({ ...payload, mobile: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* EMAIL (ab optional hai) */}
          <div>
            <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
              EMAIL
            </label>
            <div className={fieldClass("email", false)}>
              <HiOutlineMail
                size={18}
                className={
                  focusedField === "email" ? "text-blue-600" : "text-gray-400"
                }
              />
              <input
                type="email"
                className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400"
                placeholder="Enter your email id (optional)"
                value={payload.email}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) =>
                  setPayload({ ...payload, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* REFERRAL */}
          <div>
            <label className="text-gray-600 mb-1.5 text-xs font-semibold tracking-wide flex gap-1">
              REFERRAL CODE
            </label>
            <div
              className={`${fieldClass("referredBy", false)} ${
                payload.referredByFromParam ? "opacity-60" : ""
              }`}
            >
              <RiGiftLine
                size={18}
                className={
                  focusedField === "referredBy"
                    ? "text-blue-600"
                    : "text-gray-400"
                }
              />
              <input
                type="text"
                className="w-full py-3 bg-transparent outline-none border-none text-[15px] text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed"
                placeholder="Referral code"
                value={payload.referredBy}
                onFocus={() => setFocusedField("referredBy")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => {
                  if (!payload.referredByFromParam) {
                    setPayload({
                      ...payload,
                      referredBy: e.target.value?.toUpperCase(),
                    });
                  }
                }}
                disabled={payload.referredByFromParam}
              />
            </div>
          </div>

          {/* SUBMIT */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              background: "linear-gradient(135deg, #2563eb, #4338ca)",
              color: "#fff",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "12px",
              py: 1.3,
              fontSize: "15px",
              boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
                boxShadow: "0 10px 28px rgba(37,99,235,0.4)",
              },
              "&.Mui-disabled": {
                background: "rgba(37,99,235,0.2)",
                color: "#fff",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-center text-gray-500 text-sm py-2">
            HAVE AN ACCOUNT?{" "}
            <Link
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
              to={"/auth/login"}
            >
              LOG IN
            </Link>
          </p>
        </div>
      </div>

      {/* SUCCESS POPUP - registration ke baad yeh dikhega */}
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            maxWidth: "380px",
            width: "100%",
          },
        }}
      >
        <DialogContent className="text-center px-6 py-8">
          <div className="flex justify-center mb-4">
            <RiCheckboxCircleFill className="text-green-500 text-6xl" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-1">
            Registration Successful!
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Aapka account safaltapoorvak ban gaya hai.
          </p>

          <div className="text-left space-y-3 bg-gray-50 rounded-xl p-4">
            <Row label="Name" value={regSummary?.name} />
            <Row label="ID Number" value={regSummary?.idNumber} />
            <Row
              label="DOJ"
              value={
                regSummary?.doj
                  ? new Date(regSummary.doj).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"
              }
            />
            <Row label="SP Name" value={regSummary?.spName || "-"} />
            <Row label="SP ID" value={regSummary?.spId || "-"} />
          </div>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSuccessClose}
            sx={{
              mt: 3,
              background: "linear-gradient(135deg, #2563eb, #4338ca)",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              py: 1.2,
              boxShadow: "0 8px 24px rgba(37,99,235,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #1d4ed8, #3730a3)",
              },
            }}
          >
            Continue to Login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
