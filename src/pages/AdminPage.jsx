import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Plus, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  addCollectionItem,
  deleteCollectionItem,
  subscribeToCollection,
  updateCollectionItem
} from "../services/firestoreService";
import { categoryOrder } from "../config/categoryConfig";
import {
  getInitialFormValues,
  mapRecordToFormValues,
  normalizePayload
} from "../utils/formHelpers";
import { uploadPersonalAvatar, uploadProjectImages } from "../services/storageService";
import TabNav from "../components/admin/TabNav";
import CollectionForm from "../components/admin/CollectionForm";
import CollectionList from "../components/admin/CollectionList";

function AdminPage() {
  const navigate = useNavigate();
  const { user, signOutUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState("projects");
  const [recordsByCategory, setRecordsByCategory] = useState(
    categoryOrder.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );
  const [loadingByCategory, setLoadingByCategory] = useState(
    categoryOrder.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(getInitialFormValues("projects"));
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const displayEmail = useMemo(() => user?.email ?? "owner", [user]);
  const currentRecords = recordsByCategory[activeCategory] ?? [];
  const currentLoading = loadingByCategory[activeCategory];

  useEffect(() => {
    const unsubscribers = categoryOrder.map((category) =>
      subscribeToCollection(
        category,
        (records) => {
          setRecordsByCategory((previous) => ({
            ...previous,
            [category]: records
          }));
          setLoadingByCategory((previous) => ({
            ...previous,
            [category]: false
          }));
        },
        (error) => {
          setErrorMessage(error.message || "Failed to load data.");
          setLoadingByCategory((previous) => ({
            ...previous,
            [category]: false
          }));
        }
      )
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  useEffect(() => {
    setIsFormOpen(false);
    setEditingId(null);
    setSelectedImageFiles([]);
    setFormValues(getInitialFormValues(activeCategory));
  }, [activeCategory]);

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/", { replace: true });
  };

  const openAddForm = () => {
    setEditingId(null);
    setSelectedImageFiles([]);
    setFormValues(getInitialFormValues(activeCategory));
    setIsFormOpen(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.id);
    setSelectedImageFiles([]);
    setFormValues(mapRecordToFormValues(activeCategory, record));
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      setErrorMessage("");
      await deleteCollectionItem(activeCategory, id);
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete record.");
    }
  };

  const handleInputChange = (name, value) => {
    setFormValues((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleProjectImageChange = (files) => {
    const incomingFiles = Array.isArray(files)
      ? files
      : Array.from(files ?? []);

    if (incomingFiles.length === 0) {
      return;
    }

    setSelectedImageFiles((previous) => {
      if (activeCategory === "personal") {
        return [incomingFiles[0]];
      }
      return [...previous, ...incomingFiles];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const payload = normalizePayload(activeCategory, formValues);

      if (activeCategory === "projects" && selectedImageFiles.length > 0) {
        setIsImageUploading(true);
        const uploadedUrls = await uploadProjectImages(selectedImageFiles, user?.uid);
        // If editing, append to existing images. If creating, use new images
        if (editingId && Array.isArray(payload.images)) {
          payload.images = [...payload.images, ...uploadedUrls];
        } else {
          payload.images = uploadedUrls;
        }
      }

      if (activeCategory === "personal" && selectedImageFiles?.length > 0) {
        setIsImageUploading(true);
        const uploadedUrl = await uploadPersonalAvatar(selectedImageFiles[0], user?.uid);
        payload.avatar = uploadedUrl;
      }

      if (editingId) {
        await updateCollectionItem(activeCategory, editingId, payload);
      } else {
        await addCollectionItem(activeCategory, payload);
      }
      setIsFormOpen(false);
      setEditingId(null);
      setSelectedImageFiles([]);
      setFormValues(getInitialFormValues(activeCategory));
    } catch (error) {
      setErrorMessage(error.message || "Failed to save record.");
    } finally {
      setIsImageUploading(false);
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-panel p-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Admin Canvas</h1>
          <p className="text-sm text-zinc-400">Signed in as {displayEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-500"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-zinc-800 bg-panel p-5"
      >
        <TabNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-300">
              <Sparkles size={14} />
              Collection List
            </p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-100">
              Manage Entries
            </h2>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}

        <CollectionForm
          category={activeCategory}
          isOpen={isFormOpen}
          editingId={editingId}
          formValues={formValues}
          onClose={() => setIsFormOpen(false)}
          onInputChange={handleInputChange}
          onProjectImageChange={handleProjectImageChange}
          onSubmit={handleSubmit}
          isSaving={isSaving}
          isImageUploading={isImageUploading}
          selectedImageCount={selectedImageFiles.length}
        />

        <CollectionList
          category={activeCategory}
          records={currentRecords}
          loading={currentLoading}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </motion.section>
    </main>
  );
}

export default AdminPage;
