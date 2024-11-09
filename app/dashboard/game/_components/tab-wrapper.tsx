import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"

interface TabsWrapperProviderProps {
    children: {
      red: React.ReactNode;
      blue: React.ReactNode;
    }
  }
  
export function TabsWrapperProvider ({
    children
  }: TabsWrapperProviderProps) { 
    return (
      <Tabs defaultValue="red" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="red">Red</TabsTrigger>
          <TabsTrigger value="blue">Blue</TabsTrigger>
        </TabsList>
        <TabsContent value="red" className='space-y-4'>
          {children.red}
        </TabsContent>
        <TabsContent value="blue" className='space-y-4'>
          {children.blue}
        </TabsContent>
      </Tabs>
    )
  }