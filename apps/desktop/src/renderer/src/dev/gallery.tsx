import { useState, type ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Kbd,
  Label,
  ScrollArea,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeToggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  modKeyLabel,
  useCommandPalette,
  useToast,
  Search,
  Settings,
  Sparkles,
} from "@jarvis/ui-kit";

interface SectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

function Section({ title, children }: SectionProps): JSX.Element {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-4">
        {children}
      </div>
    </section>
  );
}

/** Galerie interne du Design System (mode developpement uniquement). */
export function Gallery({ onClose }: { readonly onClose: () => void }): JSX.Element {
  const { toast } = useToast();
  const { setOpen } = useCommandPalette();
  const [checked, setChecked] = useState(true);
  const [switched, setSwitched] = useState(false);

  return (
    <div className="min-h-full bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Galerie du Design System</h1>
          <Badge variant="warning">dev</Badge>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 p-6">
        <Section title="Boutons">
          <Button variant="primary">Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Lien</Button>
          <Button isLoading>Chargement</Button>
          <Button size="sm">Petit</Button>
          <Button size="lg">Grand</Button>
          <Button size="icon" aria-label="Reglages">
            <Settings size={16} />
          </Button>
        </Section>

        <Section title="Badges">
          <Badge variant="neutral">Neutre</Badge>
          <Badge variant="primary">Primaire</Badge>
          <Badge variant="success">Succes</Badge>
          <Badge variant="warning">Attention</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </Section>

        <Section title="Champs de saisie">
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="demo-input">Recherche</Label>
            <Input
              id="demo-input"
              placeholder="Tapez ici..."
              leadingAddon={<Search size={16} />}
            />
            <Input placeholder="Champ invalide" invalid />
            <Textarea placeholder="Message multiligne..." />
          </div>
        </Section>

        <Section title="Selection">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
            Case a cocher
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={switched} onCheckedChange={setSwitched} />
            Interrupteur
          </label>
        </Section>

        <Section title="Avatar & Skeleton">
          <Avatar>
            <AvatarFallback>JV</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Spinner size={20} />
        </Section>

        <Section title="Onglets">
          <Tabs defaultValue="apercu" className="w-full">
            <TabsList>
              <TabsTrigger value="apercu">Apercu</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="apercu" className="text-sm text-muted-foreground">
              Contenu de l'apercu.
            </TabsContent>
            <TabsContent value="code" className="text-sm text-muted-foreground">
              Contenu du code.
            </TabsContent>
            <TabsContent value="notes" className="text-sm text-muted-foreground">
              Contenu des notes.
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Superpositions">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary">Survolez-moi</Button>
            </TooltipTrigger>
            <TooltipContent>Ceci est une infobulle</TooltipContent>
          </Tooltip>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Ouvrir un dialogue</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Titre du dialogue</DialogTitle>
                <DialogDescription>
                  Une boite de dialogue modale, accessible et animee.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Confirmer</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Profil</DropdownMenuItem>
              <DropdownMenuItem>Parametres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Deconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Section title="Retours & feedback">
          <Button
            onClick={() =>
              toast({
                title: "Notification",
                description: "Un toast de succes.",
                variant: "success",
              })
            }
          >
            Afficher un toast
          </Button>
          <Button variant="secondary" leftIcon={<Sparkles size={16} />} onClick={() => setOpen(true)}>
            Ouvrir la palette
            <Kbd>{modKeyLabel()}</Kbd>
            <Kbd>K</Kbd>
          </Button>
        </Section>

        <Section title="Zone defilante">
          <ScrollArea className="h-32 w-full rounded-lg border border-border p-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              {Array.from({ length: 20 }, (_, index) => (
                <p key={index}>Ligne de contenu numero {index + 1}</p>
              ))}
            </div>
          </ScrollArea>
        </Section>

        <Section title="Cartes">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Titre de la carte</CardTitle>
              <CardDescription>Sous-titre descriptif.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Contenu de la carte avec du texte.
            </CardContent>
          </Card>
          <Separator orientation="vertical" className="h-24" />
        </Section>
      </div>
    </div>
  );
}
