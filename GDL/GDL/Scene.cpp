#include "GDL/Scene.h"
#include "GDL/MemTrace.h"
#include "GDL/ExtensionsManager.h"
#include "GDL/Chercher.h"
#include "GDL/Game.h"
#include "GDL/Position.h"

Scene::Scene() :
backgroundColorR(125),
backgroundColorG(125),
backgroundColorB(125),
standardSortMethod(true)
#if defined(GDE)
,wasModified(false)
#endif
{
    //ctor
    Layer layer;
    layer.SetCamerasNumber(1);
    initialLayers.push_back(layer);
}

void Scene::Init(const Scene & scene)
{
    name = scene.name;

    backgroundColorR = scene.backgroundColorR;
    backgroundColorG = scene.backgroundColorG;
    backgroundColorB = scene.backgroundColorB;
    standardSortMethod = scene.standardSortMethod;
    title = scene.title;

    events.clear();
    for (unsigned int i =0;i<scene.events.size();++i)
    	events.push_back( scene.events[i]->Clone() );

    initialObjects.clear();
    for (unsigned int i =0;i<scene.initialObjects.size();++i)
    	initialObjects.push_back( scene.initialObjects[i]->Clone() );

    objectGroups = scene.objectGroups;
    initialObjectsPositions = scene.initialObjectsPositions;
    initialLayers = scene.initialLayers;
    variables = scene.variables;
}

Scene::Scene(const Scene & scene)
{
    Init(scene);
}

Scene& Scene::operator=(const Scene & scene)
{
    if ( this != &scene )
        Init(scene);

    return *this;
}

unsigned int GD_API GetTypeIdOfObject(const Game & game, const Scene & scene, std::string name, bool searchInGroups)
{
    unsigned int objectTypeId = 0;

    //Search in objects
    int IDsceneObject = Picker::PickOneObject( &scene.initialObjects, name );
    int IDglobalObject = Picker::PickOneObject( &game.globalObjects, name );

    if ( IDsceneObject != -1 )
        objectTypeId = scene.initialObjects[IDsceneObject]->GetTypeId();
    else if ( IDglobalObject != -1 )
        objectTypeId = game.globalObjects[IDglobalObject]->GetTypeId();

    //Search in groups
    if ( searchInGroups )
    {
        for (unsigned int i = 0;i<scene.objectGroups.size();++i)
        {
            if ( scene.objectGroups[i].GetName() == name )
            {
                //A group has the name searched
                //Verifying now that all objects have the same typeId.

                vector < string > groupsObjects = scene.objectGroups[i].GetAllObjectsNames();
                unsigned int previousTypeId = groupsObjects.empty() ? 0 : GetTypeIdOfObject(game, scene, groupsObjects[0], false);

                for (unsigned int j = 0;j<groupsObjects.size();++j)
                {
                    if ( GetTypeIdOfObject(game, scene, groupsObjects[j], false) != previousTypeId )
                        return 0; //The group has more than one type.

                }

                if ( objectTypeId != 0 && previousTypeId != objectTypeId )
                    return 0; //The group has not the same type has an object

                objectTypeId = previousTypeId;
            }
        }
    }

    return objectTypeId;
}

vector < unsigned int > GD_API GetAutomatismsOfObject(const Game & game, const Scene & scene, std::string name, bool searchInGroups)
{
    bool typesAlreadyInserted = false;
    vector < unsigned int > automatims;

    //Search in objects
    int IDsceneObject = Picker::PickOneObject( &scene.initialObjects, name );
    int IDglobalObject = Picker::PickOneObject( &game.globalObjects, name );

    if ( IDsceneObject != -1 )
    {
        vector < unsigned int > objectAutomatisms = scene.initialObjects[IDsceneObject]->GetAllAutomatismsTypes();
        copy(objectAutomatisms.begin(), objectAutomatisms.end(), back_inserter(automatims));
        typesAlreadyInserted = true;
    }
    else if ( IDglobalObject != -1 )
    {
        vector < unsigned int > objectAutomatisms = game.globalObjects[IDglobalObject]->GetAllAutomatismsTypes();
        copy(objectAutomatisms.begin(), objectAutomatisms.end(), back_inserter(automatims));
        typesAlreadyInserted = true;
    }

    //Search in groups
    if ( searchInGroups )
    {
        for (unsigned int i = 0;i<scene.objectGroups.size();++i)
        {
            if ( scene.objectGroups[i].GetName() == name )
            {
                //A group has the name searched
                //Verifying now that all objects have common automatisms.

                vector < string > groupsObjects = scene.objectGroups[i].GetAllObjectsNames();
                for (unsigned int j = 0;j<groupsObjects.size();++j)
                {
                    //Get automatisms of the object of the group and delete automatism which are not in commons.
                	vector < unsigned int > objectAutomatisms = GetAutomatismsOfObject(game, scene, groupsObjects[j], false);
                	if (!typesAlreadyInserted)
                	    automatims = objectAutomatisms;
                	else
                	{
                        for (unsigned int a = 0 ;a<automatims.size();++a)
                        {
                            if ( find(objectAutomatisms.begin(), objectAutomatisms.end(), automatims[a]) == objectAutomatisms.end() )
                            {
                                automatims.erase(automatims.begin() + a);
                                --a;
                            }
                        }
                	}
                }
            }
        }
    }

    return automatims;
}
